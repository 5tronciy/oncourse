/*
 * Copyright ish group pty ltd. All rights reserved. https://www.ish.com.au
 * No copying or use of this code is allowed without permission in writing from ish.
 */

import { store } from "../TestEntry";
import { PreferenceEnum } from "@api/model";
import { FETCH_FINISH, FETCH_START, SET_USER_PREFERENCE } from "../../js/common/actions";
import { EpicGetUserPreferences } from "../../js/common/epics/EpicGetUserPreferences";
import { filter, toArray } from "rxjs/operators";

export const SetPreferences = (keys: PreferenceEnum[]) => {
  // Redux action to trigger epic
  // const action$ = ActionsObservable.of({ type: SET_USER_PREFERENCE, payload: keys });

  // Initializing epic instance
  const epic$ = EpicGetUserPreferences(null, store, {});

  // Testing epic to be resolved with expected array of actions
  return expect(
    epic$
      // Filtering common actions
      .pipe(
        // Filtering common actions
        filter(a => [FETCH_START, FETCH_FINISH].includes(a.type) === false),
        toArray()
      )
      .toPromise()
  ).resolves.toEqual([]);
};
