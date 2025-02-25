/*
 * Copyright ish group pty ltd. All rights reserved. https://www.ish.com.au
 * No copying or use of this code is allowed without permission in writing from ish.
 */

import * as React from "react";
import { alpha, darken } from '@mui/material/styles';
import createStyles from "@mui/styles/createStyles";
import withStyles from "@mui/styles/withStyles";
import { grey } from "@mui/material/colors";
import getOS from "../utils/getOS";
import { AppTheme } from "../../model/common/Theme";
import christmasHeaderBackground from "../../../images/beach-header.jpg";
import christmasBodyBackground from "../../../images/sparkel.png";
import christmasBodyBackgroundStars from "../../../images/christmas_header_background.gif";
import InterRomanVar from "../../../fonts/inter/Inter-Roman.var.woff2";
import InterItalicVar from "../../../fonts/inter/Inter-Italic.var.woff2";
import { animateStyles } from "./animateStyles";
import { bootstrap } from "./bootstrap";

const customOSScrollbars = getOS() === "Windows"
    ? {
        "::-webkit-scrollbar": {
          width: 8,
          height: 8,
          backgroundColor: "rgba(0,0,0,0)",
          "-webkit-border-radius": "100px"
        },

        "::-webkit-scrollbar:hover": {
          backgroundColor: "rgba(0, 0, 0, 0.09)"
        },

        "::-webkit-scrollbar-thumb": {
          background: "rgba(0,0,0,0.5)",
          "-webkit-border-radius": "100px"
        },

        "::-webkit-scrollbar-thumb:active": {
          background: "rgba(0,0,0,0.61)",
          "-webkit-border-radius": "100px"
        },

        "::-webkit-scrollbar-thumb:vertical": {
          minHeight: 10
        },

        "::-webkit-scrollbar-thumb:horizontal": {
          minWidth: 10
        }
      }
    : {};

const globalStyles = (theme: AppTheme) =>
  createStyles({
    "@global": {
      ...theme.palette.mode === "dark" ? { "a": { color: "#90caf9" } } : {},
        "@font-face": [
        {
          fontFamily: "Inter",
          fontWeight: `100 900`,
          fontDisplay: "swap",
          fontStyle: "normal",
          fallbacks: [
            { src: `local('Inter'), url(${InterRomanVar}) format("woff2")` }
          ]
        },
        {
          fontFamily: "Inter",
          fontWeight: `100 900`,
          fontDisplay: "swap",
          fontStyle: "italic",
          fallbacks: [
            { src: `local('Inter'), url(${InterItalicVar}) format("woff2")` }
          ]
        }
      ],
      ".appFrame": {
        position: "relative",
        height: "100vh",
        background: theme.palette.background.default,
        flex: 1,
        maxWidth: "100%"
      },
      ".activeAvatar": {
        color: theme.palette.primary.contrastText,
        backgroundColor: theme.palette.primary.main,
      },
      ".root": {
        position: "relative",
        display: "flex",
        width: "100%",
        height: "100vh",
        overflowY: "hidden"
      },
      ".container": {
        display: "flex",
        flexWrap: "wrap"
      },
      ".codeArea": {
        borderRadius: theme.shape.borderRadius,
        background: theme.table.contrastRow.main,
        padding: theme.spacing(1),
        border: "none",
        outline: "none",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
        fontSize: "inherit",
        fontFamily: "inherit",
        color: "inherit",
        width: "100%"
      },
      ".appBarContainer": {
        marginTop: theme.spacing(8),
        height: `calc(100vh - ${theme.spacing(8)})`,
        overflowY: "auto"
      },
      ".card": {
        marginBottom: "20px",
        padding: "20px",
        minWidth: "800px"
      },
      ".saveButtonTableOffset": {
        marginBottom: theme.spacing(8)
      },
      ".editViewHeadingOffset": {
        marginTop: `-${theme.spacing(2)}`
      },
      ".heading": {
        textTransform: "uppercase",
        fontFamily: theme.typography.fontFamily,
        fontSize: theme.typography.fontSize,
        fontWeight: "bold" as "bold",
        color: theme.heading.color,
        lineHeight: 1.22
      },
      ".secondaryHeading": {
        textTransform: "uppercase",
        fontFamily: theme.typography.fontFamily,
        fontSize: theme.typography.fontSize - 2,
        fontWeight: 600,
        color: theme.heading.color,
        lineHeight: 1.45
      },
      ".normalHeading": {
        fontFamily: theme.typography.fontFamily,
        fontSize: theme.typography.fontSize,
        fontWeight: 600,
        color: theme.heading.color,
        lineHeight: 1.45
      },
      ".checkbox": {
        height: "35px",
        overflow: "hidden"
      },
      ".checkboxWidth": {
        width: "35px"
      },
      ".placeholderContent": {
        color: theme.palette.divider,
        fill: theme.palette.divider,
        fontWeight: 400,
      },
      ".link": {
        color: "inherit",
        textDecoration: "none"
      },
      ".listItemPadding": {
        padding: theme.spacing(0.75, 3),
        minHeight: "unset"
      },
      ".appBarFab": {
        top: "31px",
        backgroundColor: "black"
      },
      ".payslipButton": {
        "&:hover": {
          backgroundColor: darken(theme.palette.primary.main, 0.1)
        }
      },
      ".moreOptions": {
        boxShadow: theme.shadows[0],
        color: theme.palette.primary.contrastText,
        backgroundColor: theme.palette.primary.main,
        "&:hover": {
          color: theme.palette.primary.contrastText,
          backgroundColor: alpha(theme.palette.primary.main, 0.9)
        },
        margin: theme.spacing(0, 1)
      },
      ".moreOptionsDisabled": {
        color: `${theme.palette.grey[500]} !important`,
        backgroundColor: `${theme.palette.grey[300]} !important`
      },
      ".saveButtonEditView": {
        boxShadow: theme.shadows[2],
        "&:hover": {
          backgroundColor: darken(theme.palette.primary.main, 0.1)
        },
        margin: theme.spacing(1)
      },
      ".saveButtonEditViewDisabled": {
        color: `${theme.palette.grey[500]} !important`,
        backgroundColor: `${theme.palette.grey[300]} !important`
      },
      ".integrationsButton": {
        "&:hover": {
          backgroundColor: darken(theme.palette.primary.main, 0.1)
        }
      },
      ".licencesUpgradeButton": {
        "&:hover": {
          backgroundColor: darken(theme.palette.primary.main, 0.1)
        }
      },
      ".closeAppBarButton": {
        color: theme.appBarButton.close.color
      },
      ".whiteAppBarButton": {
        color: theme.palette.primary.main,
        backgroundColor: theme.palette.primary.contrastText,
        marginLeft: theme.spacing(1),
        "&:hover": {
          color: theme.palette.primary.main,
          backgroundColor: alpha(theme.palette.primary.contrastText, 0.9)
        }
      },
      ".whiteAppBarButtonDisabled": {
        color: `${theme.palette.primary.main} !important`,
        backgroundColor: `${alpha(theme.palette.primary.contrastText, 0.3)} !important`
      },
      ".avetmissButton": {
        "&:hover": {
          backgroundColor: darken(theme.palette.primary.main, 0.1)
        }
      },
      ".hoverGrayIcon": {
        "&:hover": {
          fill: theme.palette.action.hover
        }
      },
      ".dndActionIconButton": {
        "&:hover .dndActionIcon": {
          fill: theme.palette.action.active
        }
      },
      ".dndActionIcon": {
        fill: theme.palette.action.hover,
        "&:hover": {
          fill: theme.palette.action.active
        }
      },
      ".fitSmallWidth": {
        [theme.breakpoints.down("xs")]: {
          maxWidth: "calc(100% - 48px)"
        }
      },
      ".inputAdornmentButton": {
        width: "16px",
        height: "16px",
        bottom: "1px",
        padding: 0,
        "&:hover .placeholderContent": {
          fill: theme.palette.primary.main,
          color: theme.palette.primary.main,
          fontWeight: 400,
        }
      },
      ".inputAdornmentIcon": {
        fontSize: theme.spacing(2),
      },
      ".switchLabel": {
        marginRight: "auto",
        paddingRight: theme.spacing(2),
        paddingTop: "1px",
        fontSize: `${theme.typography.fontSize}px`
      },
      ".switchWrapper": {
        flexDirection: "row-reverse",
        marginLeft: 0
      },
      ".switchLabelMargin": {
        marginRight: "100px"
      },
      ".addButtonColor": {
        color: theme.palette.mode === "light" ? "#f7941d" : darken(grey[400], 0.1)
      },
      ".labelOffset": {
        marginLeft: "-14px"
      },
      ".listEditViewOffset": {
        paddingRight: theme.spacing(8)
      },
      ".inlineIcon": {
        marginTop: "2px",
        fontSize: "0.875rem",
        marginLeft: "0.2rem"
      },
      ".editInPlaceIcon": {
        // visibility: "hidden",
        fontSize: "14px",
        color: theme.palette.divider,
        verticalAlign: "middle",
      },
      ".coloredHover": {
        "&:hover": {
          color: theme.palette.primary.main
        }
      },
      ".submitButton": {
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText
      },
      ".documentsSubmitButton": {
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
        "&:hover": {
          backgroundColor: darken(theme.palette.primary.main, 0.1),
          color: theme.palette.primary.contrastText
        }
      },
      ".textField": {
        // @ts-ignore
        paddingBottom: `${theme.spacing(2) - 3}px`,
        paddingLeft: "0",
        overflow: "hidden",
        display: "flex",
        "&.d-none": {
          display: "none"
        }
      },
      ".errorColor": {
        color: theme.palette.error.light
      },
      ".errorBackgroundColor": {
        backgroundColor: theme.palette.error.main
      },
      ".errorColorFade-0-2": {
        color: alpha(theme.palette.error.main, 0.2)
      },
      ".errorContrastColor": {
        color: theme.palette.error.contrastText
      },
      ".primaryColor": {
        color: theme.palette.primary.main
      },
      ".warningColor": {
        color: theme.palette.warning.light
      },
      ".successColor": {
        color: theme.palette.success.light
      },
      ".successBackgroundColor": {
        backgroundColor: theme.palette.success.light
      },
      ".primaryContarstText": {
        color: theme.palette.primary.contrastText
      },
      ".primaryContarstHover": {
        "&:hover": {
          color: theme.palette.primary.contrastText
        }
      },
      ".primaryContarstUnderline": {
        "&:after": {
          borderBottomColor: theme.palette.primary.contrastText
        }
      },
      ".defaultBackgroundColor": {
        backgroundColor: theme.palette.background.default
      },
      ".paperBackgroundColor": {
        background: theme.palette.background.paper
      },
      ".paperTextColor": {
        color: theme.palette.background.paper
      },
      ".fullHeightWithoutAppBar": {
        height: "calc(100vh - 64px)"
      },
      ".linkDecoration": {
        cursor: "pointer",
        "&:hover": {
          textDecoration: "underline",
          color: theme.palette.secondary.main
        }
      },
      ".graySmallFont12": {
        color: theme.statistics.rightColumn.color,
        fontSize: "12px"
      },
      ".smallIconButton": {
        width: theme.spacing(4),
        height: theme.spacing(4),
        padding: theme.spacing(0.5)
      },
      ".lightGrayIconButton": {
        color: alpha(theme.palette.text.primary, 0.2),
        fontSize: "18px",
        width: theme.spacing(4),
        height: theme.spacing(4),
        padding: theme.spacing(1)
      },
      ".noRecordsMessage": {
        color: theme.palette.grey[400],
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        display: "flex"
      },
      ".textPrimaryColor": {
        color: theme.palette.text.primary
      },
      ".textSecondaryColor": {
        color: theme.palette.text.secondary
      },
      ".iconColor": {
        color: theme.palette.text.secondary,
        marginLeft: theme.spacing(1)
      },
      ".money": {
        fontFeatureSettings: '"tnum", "zero"'
      },
      ".closeAndClearButton": {
        padding: theme.spacing(1)
      },
      ".listHeadingPadding": {
        padding: theme.spacing(1.5,3),
      },
      ".appHeaderFontSize": {
        fontSize: "1.125rem"
      },
      ".backgroundText": {
        fontSize: theme.spacing(10),
        textTransform: "uppercase",
        position: "absolute",
        top: "210px",
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 0,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        transform: "rotate(-35deg)",
        fontWeight: theme.typography.fontWeightBold,
        userSelect: "none",
        height: "200px"
      },
      ".summaryTopBorder": {
        borderTop: `1px solid ${theme.palette.text.primary}`
      },
      ".christmasBody": {
        backgroundImage: `url(${christmasBodyBackground})`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "bottom left",
        backgroundSize: "60%"
      },
      ".christmasBackground": {
        background: "transparent"
      },
      ".christmasHeader": {
        "&:before": {
          content: "''",
          backgroundImage: `url(${christmasBodyBackgroundStars})`,
          position: "absolute",
          top: 0,
          left: 0,
          height: "100%",
          width: "100%"
        }
      },
      ".christmasHeaderDashboard": {
        backgroundImage: `url(${christmasHeaderBackground})`,
        backgroundSize: "cover",
        backgroundPosition: "top"
      },
      ".selectedItemArrow": {
        [theme.breakpoints.up("md")]: {
          "&::after, &::before": {
            content: `""`,
            position: "absolute",
            top: "50%"
          },
          "&::after": {
            borderTop: "25px solid transparent",
            borderRight: `25px solid ${theme.palette.background.default}`,
            borderBottom: "25px solid transparent",
            transform: "translateY(-50%)",
            right: -33,
            zIndex: 1
          },
          "&::before": {
            borderTop: `1px solid ${theme.palette.divider}`,
            borderRight: "1px solid transparent",
            borderLeft: `1px solid ${theme.palette.divider}`,
            transform: "translateY(-50%) rotate(-45deg)",
            right: -50,
            zIndex: 2,
            padding: 17
          }
        }
      },
      ".selectItmeIcon": {
        fontSize: "16px",
        position: "relative",
        bottom: "-3px"
      },
      ".hoverIconContainer": {
        "&:hover .hoverIcon": {
          color: "inherit",
          visibility: "visible",
        }
      },
      ".generalRoot": {
        padding: theme.spacing(1, 3, 0)
      },
      ".gridTemplateColumns-1fr": {
        gridTemplateColumns: "minmax(0, 1fr) auto"
      },
      ".gridAutoFlow-column": {
        gridAutoFlow: "column"
      },
      ...bootstrap(theme),
      ...customOSScrollbars,
      ...animateStyles
    }
  });

const GlobalStylesProvider = props => <div>{props.children}</div>;

export default withStyles(globalStyles, { index: 10000 })(GlobalStylesProvider);
