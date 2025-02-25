/**
 * Copyright ish group pty ltd. All rights reserved. http://www.ish.com.au
 * No copying or use of this code is allowed without permission in writing from ish.
 */
package ish.oncourse.server.security


import groovy.transform.CompileStatic
import ish.TestWithBootique
import org.apache.commons.lang3.time.DateUtils
import org.apache.logging.log4j.LogManager
import org.apache.logging.log4j.Logger
import org.junit.jupiter.api.Assertions
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test

import java.security.KeyStore
import java.security.cert.X509Certificate

@CompileStatic
class KeystoreGeneratorTest  {
    private static final Logger logger = LogManager.getLogger()

    private static final Long MILLISECONDS_IN_DAY = 24 * 60 * 60 * 1000L

    private final static String TEST_KEYSTORE_NAME = "test.keystore"
    private final static String TEST_KEYSTORE_ALGORITHM = "RSA"
    private final static String TEST_KEYSTORE_PASS = "testPass"
    private final static String TEST_ALIAS = "testAlias"
    private final static String TEST_KEY_PASS = "testPass"

    final static String[] keystoreCreateCommand = [
            "keytool",
            "-genkey",
            "-keystore",
            TEST_KEYSTORE_NAME,
            "-alias",
            TEST_ALIAS,
            "-keyalg",
            TEST_KEYSTORE_ALGORITHM,
            "-dname",
            KeystoreGenerator.DNAME,
            "-storepass",
            TEST_KEYSTORE_PASS,
            "-keypass",
            TEST_KEY_PASS,
            "-validity",
            String.valueOf(KeystoreGenerator.VALIDITY),
            "-storetype",
            "jks"]

    @BeforeEach
    void setup() {
        deleteKeystoreFile()
    }

    /**
     * test if the certificate is loaded properly
     *
     * @throws Exception
     */
    
    @Test
    void testKeystoreSaveAndLoad() throws Exception {
        try {
            Assertions.assertFalse(new File(TEST_KEYSTORE_NAME).exists())

            KeyStore ks = KeystoreGenerator.getClientServerKeystore(TEST_KEYSTORE_NAME, TEST_KEYSTORE_ALGORITHM, TEST_ALIAS, TEST_KEYSTORE_PASS, TEST_KEY_PASS)
            Assertions.assertNotNull(ks)
            Assertions.assertNotNull(ks.getKey(TEST_ALIAS, TEST_KEY_PASS.toCharArray()))
            Assertions.assertNotNull(ks.getCertificate(TEST_ALIAS))
            Assertions.assertTrue(ks.getCertificate(TEST_ALIAS) instanceof X509Certificate)

            Date from = ((X509Certificate) ks.getCertificate(TEST_ALIAS)).getNotBefore()
            Date expectedExpiryDate = DateUtils.addDays(from, KeystoreGenerator.VALIDITY)
            Date to = ((X509Certificate) ks.getCertificate(TEST_ALIAS)).getNotAfter()

            Assertions.assertEquals(expectedExpiryDate, to)
            Assertions.assertTrue(from.before(new Date()))
            Assertions.assertTrue(to.after(new Date()))

            Assertions.assertTrue(new File(TEST_KEYSTORE_NAME).exists())

            KeyStore ks2 = KeystoreGenerator.loadKeystore(TEST_KEYSTORE_NAME, TEST_KEYSTORE_PASS)
            Assertions.assertNotNull(ks2)
            Assertions.assertNotNull(ks2.getKey(TEST_ALIAS, TEST_KEY_PASS.toCharArray()))
            Assertions.assertNotNull(ks.getCertificate(TEST_ALIAS))
            Assertions.assertTrue(ks.getCertificate(TEST_ALIAS) instanceof X509Certificate)

            from = ((X509Certificate) ks.getCertificate(TEST_ALIAS)).getNotBefore()
            expectedExpiryDate = DateUtils.addDays(from, KeystoreGenerator.VALIDITY)
            to = ((X509Certificate) ks.getCertificate(TEST_ALIAS)).getNotAfter()

            Assertions.assertEquals(expectedExpiryDate, to)
            Assertions.assertTrue(from.before(new Date()))
            Assertions.assertTrue(to.after(new Date()))

        } catch (Exception e) {
            logAndFail("cannot create keystore generator", e)
        }
    }

    /**
     * test provided to verify if the new KeystoreGenerator output is the same as the output from keytool we used prior
     *
     * @throws Exception
     */
    
    @Test
    void testKeystoreAgainstKeytool() throws Exception {
        final Process createProcess = Runtime.getRuntime().exec(keystoreCreateCommand)
        readStream(new BufferedInputStream(createProcess.getInputStream()))
        readStream(new BufferedInputStream(createProcess.getErrorStream()))

        createProcess.waitFor()
        Assertions.assertTrue(new File(TEST_KEYSTORE_NAME).exists())
        try {
            KeyStore ks2 = KeystoreGenerator.loadKeystore(TEST_KEYSTORE_NAME, TEST_KEYSTORE_PASS)
            Assertions.assertNotNull(ks2)
            Assertions.assertNotNull(ks2.getKey(TEST_ALIAS, TEST_KEY_PASS.toCharArray()))
            Assertions.assertNotNull(ks2.getCertificate(TEST_ALIAS))
            Assertions.assertTrue(ks2.getCertificate(TEST_ALIAS) instanceof X509Certificate)

            //This certificate is generated by using Java Keytool. It adds physical time without any offsets.
            //So lifetime of certificate equals DAYS * MILLISECONDS_IN_DAY (days * 24 * 60 * 60 * 1000 milliseconds)
            Date from = ((X509Certificate) ks2.getCertificate(TEST_ALIAS)).getNotBefore()
            Date expectedExpiryDate = new Date()
            expectedExpiryDate.setTime(from.getTime() + KeystoreGenerator.VALIDITY * MILLISECONDS_IN_DAY)
            Date to = ((X509Certificate) ks2.getCertificate(TEST_ALIAS)).getNotAfter()

            Assertions.assertEquals(expectedExpiryDate, to)
            Assertions.assertTrue(from.before(new Date()))
            Assertions.assertTrue(to.after(new Date()))

        } catch (Exception e) {
            logAndFail("fail", e)
        }
    }

    // ----------- utils
    private void deleteKeystoreFile() {
        new File(TEST_KEYSTORE_NAME).delete()
    }

    
    private void logAndFail(String message, Exception e) {
        logger.warn(message, e)
        Assertions.fail(message)
    }

    protected static ByteArrayOutputStream readStream(BufferedInputStream inStream) throws IOException {
        int bytes
        ByteArrayOutputStream bytesout = new ByteArrayOutputStream()
        try {
            byte[] input = new byte[1024]
            while ((bytes = inStream.read(input, 0, 1024)) != -1) {
                bytesout.write(input, 0, bytes);
            }
        } catch (IOException e) {
            logger.debug("Error transforming keytool stream in bytestream")
        } finally {
            bytesout.flush()
            bytesout.close()
        }
        return bytesout
    }
}
