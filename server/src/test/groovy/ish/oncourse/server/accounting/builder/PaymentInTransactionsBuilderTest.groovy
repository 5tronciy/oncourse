package ish.oncourse.server.accounting.builder

import ish.common.types.AccountTransactionType
import ish.common.types.PaymentType
import ish.math.Money
import ish.oncourse.server.accounting.AccountTransactionDetail
import ish.oncourse.server.accounting.TransactionSettings
import ish.oncourse.server.cayenne.Account
import ish.oncourse.server.cayenne.Banking
import ish.oncourse.server.cayenne.Invoice
import ish.oncourse.server.cayenne.PaymentIn
import ish.oncourse.server.cayenne.PaymentInLine
import ish.oncourse.server.cayenne.PaymentMethod
import static junit.framework.TestCase.assertEquals
import static junit.framework.TestCase.assertTrue
import org.junit.Before
import org.junit.Test
import static org.mockito.Mockito.mock
import static org.mockito.Mockito.when

import java.time.LocalDate
import java.time.Month

class PaymentInTransactionsBuilderTest {

    private PaymentInLine paymentInLine
    private Account voucherExpense
    private PaymentIn paymentIn
    private Money amountPaid
    private PaymentMethod paymentMethod
    private Account primaryAccountDeposit
    private Account primaryAccountUndeposit
    private Account secondaryAccount
    private Money amount
    private LocalDate transactionDate
    private Long foreignRecordId
    private Money amountOf2Tr

    @Before
    void prepareData() {
        foreignRecordId = 123456L

        voucherExpense = mock(Account)
        when(voucherExpense.id).thenReturn(321L)
        primaryAccountDeposit = mock(Account)
        when(primaryAccountDeposit.id).thenReturn(551L)
        primaryAccountUndeposit = mock(Account)
        when(primaryAccountUndeposit.id).thenReturn(771L)
        secondaryAccount = mock(Account)
        when(secondaryAccount.id).thenReturn(881L)


        transactionDate = LocalDate.of(2016, Month.JUNE, 12)

        
        paymentMethod = mock(PaymentMethod)
        when(paymentMethod.type).thenReturn(PaymentType.CASH)
        when(paymentMethod.bankedAutomatically).thenReturn(true)

        amountPaid = new Money(300)
        Banking banking = mock(Banking)
        paymentIn = mock(PaymentIn)
        when(paymentIn.paymentDate).thenReturn(transactionDate)
        when(paymentIn.paymentMethod).thenReturn(paymentMethod)
        when(paymentIn.banking).thenReturn(banking)
        when(paymentIn.undepositedFundsAccount).thenReturn(primaryAccountUndeposit)
        when(paymentIn.accountIn).thenReturn(primaryAccountDeposit)
        when(paymentIn.amount).thenReturn(amountPaid)

        amount = new Money(99)

        Invoice invoice = mock(Invoice)
        when(invoice.debtorsAccount).thenReturn(secondaryAccount)

        paymentInLine = mock(PaymentInLine)
        when(paymentInLine.paymentIn).thenReturn(paymentIn)
        when(paymentInLine.amount).thenReturn(amount)
        when(paymentInLine.invoice).thenReturn(invoice)
        when(paymentInLine.id).thenReturn(foreignRecordId)
        
        amountOf2Tr = new Money(33)
    }
    
    
    @Test
    void test() {
        TransactionSettings settings = PaymentInTransactionsBuilder.valueOf(paymentInLine, voucherExpense).build()
        assertTrue(settings.isInitialTransaction)
        assertEquals(1, settings.details.size())
        AccountTransactionDetail detail = settings.details[0]
        assertEquals(primaryAccountDeposit.id, detail.primaryAccount.id)
        assertEquals(secondaryAccount.id, detail.secondaryAccount.id)
        assertEquals(amount, detail.amount)
        assertEquals(foreignRecordId, detail.foreignRecordId)
        assertEquals(AccountTransactionType.PAYMENT_IN_LINE, detail.tableName)
        assertEquals(transactionDate, detail.transactionDate)

        
        when(paymentIn.banking).thenReturn(null)
        settings = PaymentInTransactionsBuilder.valueOf(paymentInLine, voucherExpense).build()
        assertTrue(settings.isInitialTransaction)
        assertEquals(1, settings.details.size())
        detail = settings.details[0]
        assertEquals(primaryAccountUndeposit.id, detail.primaryAccount.id)
        assertEquals(secondaryAccount.id, detail.secondaryAccount.id)
        assertEquals(amount, detail.amount)
        assertEquals(foreignRecordId, detail.foreignRecordId)
        assertEquals(AccountTransactionType.PAYMENT_IN_LINE, detail.tableName)
        assertEquals(transactionDate, detail.transactionDate)


        when(paymentMethod.type).thenReturn(PaymentType.VOUCHER)
        settings = PaymentInTransactionsBuilder.valueOf(paymentInLine, voucherExpense, { amountOf2Tr }).build()
        assertTrue(settings.isInitialTransaction)
        assertEquals(2, settings.details.size())
        detail = settings.details[0]
        assertEquals(voucherExpense.id, detail.primaryAccount.id)
        assertEquals(secondaryAccount.id, detail.secondaryAccount.id)
        assertEquals(amount, detail.amount)
        assertEquals(foreignRecordId, detail.foreignRecordId)
        assertEquals(AccountTransactionType.PAYMENT_IN_LINE, detail.tableName)
        assertEquals(transactionDate, detail.transactionDate)

        detail = settings.details[1]
        assertEquals(voucherExpense.id, detail.primaryAccount.id)
        assertEquals(primaryAccountDeposit.id, detail.secondaryAccount.id)
        assertEquals(amountOf2Tr, detail.amount)
        assertEquals(foreignRecordId, detail.foreignRecordId)
        assertEquals(AccountTransactionType.PAYMENT_IN_LINE, detail.tableName)
        assertEquals(transactionDate, detail.transactionDate)
    }
    
}
