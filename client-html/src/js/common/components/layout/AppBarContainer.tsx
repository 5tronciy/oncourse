/*
 * Copyright ish group pty ltd 2021.
 *
 * This program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License version 3 as published by the Free Software Foundation.
 *
 *  This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.
 */

import React, {
  useState, useCallback
} from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { InjectedFormProps } from "redux-form";
import clsx from "clsx";
import { makeStyles } from "@mui/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import Button from "@mui/material/Button";
import { APP_BAR_HEIGHT, APPLICATION_THEME_STORAGE_NAME } from "../../../constants/Config";
import { LSGetItem } from "../../utils/storage";
import { useStickyScrollSpy } from "../../utils/hooks";
import { openDrawer } from "../../actions";
import AppBarHelpMenu from "../form/AppBarHelpMenu";
import FormSubmitButton from "../form/FormSubmitButton";
import FullScreenStickyHeader from "../list-view/components/full-screen-edit-view/FullScreenStickyHeader";
import { VARIANTS } from "./swipeable-sidebar/utils";
import HamburgerMenu from "./swipeable-sidebar/components/HamburgerMenu";
import { AppTheme } from "../../../model/common/Theme";

const useStyles = makeStyles((theme: AppTheme) => ({
  header: {
    width: "100%",
    background: theme.appBar.header.background,
    color: theme.appBar.header.color,
    zIndex: theme.zIndex.drawer + 1,
    height: `${APP_BAR_HEIGHT}px`
  },
  headerHighContrast: {
    background: theme.palette.background.default,
  },
  hiddenContainer: {
    display: "none"
  },
  drawerToggle: {
    marginRight: theme.spacing(1),
    marginLeft: theme.spacing(-1)
  },
  container: {
    padding: theme.spacing(4, 3, 3, 3),
    background: theme.appBar.header.background,
  },
  headerAlternate: {
    background: `${theme.appBar.headerAlternate.background}`,
    color: `${theme.appBar.headerAlternate.color}`,
    "& $actionsWrapper svg": {
      color: `${theme.appBar.headerAlternate.color}`,
    }
  },
  submitButtonAlternate: {
    background: `${theme.appBar.headerAlternate.color}`,
    color: `${theme.appBar.headerAlternate.background}`,
  },
  fullScreenTitleItem: {
    position: "relative",
    maxWidth: "100%",
    zIndex: 1,
    marginTop: 8,
  },
  scriptAddMenu: {
    position: "absolute",
    zIndex: theme.zIndex.drawer + 2,
    left: 26,
    top: 43,
    "& > .appBarFab": {
      top: 0,
      left: 0,
    }
  },
  headerFabOffset: {
    paddingLeft: theme.spacing(8.75)
  },
  actionsWrapper: {
    display: "flex"
  }
}));

interface Props extends InjectedFormProps {
  title?: any;
  actions?: any;
  hideHelpMenu?: boolean;
  noDrawer?: boolean;
  drawerHandler?: () => void;
  children?: any;
  values?: any;
  getAuditsUrl?: string | ((id: number) => string);
  manualUrl?: string;
  disabled?: boolean;
  fields?: any;
  opened?: boolean;
  disableInteraction?: boolean;
  hideSubmitButton?: boolean;
  disabledScrolling?: boolean;
  createdOn?: (values: any) => string;
  modifiedOn?: (values: any) => string;
  onAddMenu?: () => void;
  customAddMenu?: any;
  submitButtonText?: string;
  onCloseClick?: () => void;
  hamburgerMenu?: boolean;
}

const AppBarContainer: React.FC<Props> = props => {
  const {
    title, actions, hideHelpMenu, children, noDrawer, drawerHandler, values, manualUrl, getAuditsUrl, disabled, invalid, fields,
    disableInteraction, hideSubmitButton, disabledScrolling, createdOn, modifiedOn, onAddMenu, customAddMenu, submitButtonText,
    onCloseClick, hamburgerMenu, opened
  } = props;

  const classes = useStyles();

  const { scrollSpy } = useStickyScrollSpy();

  const [hasScrolling, setScrolling] = useState<boolean>(false);

  const onScroll = useCallback(
    e => {
      scrollSpy(e);
      if (e.target) {
        const isScrolling = e.target.scrollTop > 20;
        setScrolling(isScrolling);
      }
    },
    []
  );

  const isSmallScreen = useMediaQuery('(max-width:992px)');
  const isDarkTheme = LSGetItem(APPLICATION_THEME_STORAGE_NAME) === "dark";
  const isHighcontrastTheme = LSGetItem(APPLICATION_THEME_STORAGE_NAME) === "highcontrast";

  const hasFab = onAddMenu || customAddMenu;

  return (
    <>
      <AppBar
        elevation={0}
        position="absolute"
        className={clsx(
          classes.header,
          hasFab && classes.headerFabOffset,
          opened && "pt-2",
          LSGetItem(APPLICATION_THEME_STORAGE_NAME) === "christmas" && "christmasHeader",
          { [classes.headerAlternate]: hasScrolling },
          { [classes.headerHighContrast]: isHighcontrastTheme }
        )}
      >
        <Toolbar>
          {!noDrawer && !hamburgerMenu && (
            <IconButton
              color="inherit"
              aria-label="Open drawer"
              onClick={drawerHandler}
              className={clsx(!isSmallScreen && classes.hiddenContainer, classes.drawerToggle)}
            >
              <MenuIcon />
            </IconButton>
          )}
          {hamburgerMenu && (
            <HamburgerMenu variant={VARIANTS.temporary} />
          )}
 
          <FullScreenStickyHeader
            opened={opened}
            title={title}
            fields={fields}
            disableInteraction={disableInteraction}
            twoColumn
          />
          <div className="flex-fill" />
          <div className={classes.actionsWrapper}>
            {actions}
            {!hideHelpMenu && values && (
              <AppBarHelpMenu
                created={values && (createdOn ? createdOn(values) : (values.createdOn ? new Date(values.createdOn) : null))}
                modified={values && (modifiedOn ? modifiedOn(values) : (values.modifiedOn ? new Date(values.modifiedOn) : null))}
                manualUrl={manualUrl}
                auditsUrl={values && getAuditsUrl && (typeof getAuditsUrl === "string" ? getAuditsUrl : getAuditsUrl(values.id))}
              />
            )}

            {onCloseClick && (
              <Button
                onClick={onCloseClick}
                className={clsx("closeAppBarButton", hasScrolling && classes.headerAlternate)}
              >
                Close
              </Button>
            )}
          </div>
          {!hideSubmitButton && (
            <FormSubmitButton
              disabled={disabled}
              invalid={invalid}
              className={isDarkTheme && classes.submitButtonAlternate}
              text={submitButtonText || "Save"}
              fab
            />
          )}
        </Toolbar>
      </AppBar>
      <div className={clsx("w-100", { "appBarContainer": !disabledScrolling }, classes.container)} onScroll={onScroll}>
        {hasFab && (
          <div className={classes.scriptAddMenu}>
            {customAddMenu || (
              <Fab
                type="button"
                size="small"
                color="primary"
                classes={{
                  sizeSmall: "appBarFab"
                }}
                onClick={onAddMenu}
              >
                <AddIcon />
              </Fab>
            )}
          </div>
        )}
        {children}
      </div>
    </>
  );
};

const mapDispatchToProps = (dispatch: Dispatch<any>) => ({
  drawerHandler: () => dispatch(openDrawer())
});

export default connect<any, any, any>(
  null,
  mapDispatchToProps
)(AppBarContainer);
