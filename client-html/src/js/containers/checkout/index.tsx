/*
 * Copyright ish group pty ltd 2023.
 *
 * This program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License version 3 as published by the Free Software Foundation.
 *
 *  This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.
 */

import React from "react";
import Loadable from "@react-loadable/revised";
import Loading from "../../common/components/progress/Loading";

const LoadableComponent = Loadable({
  loader: () => import(/* webpackChunkName: "checkout" */ "./Checkout"),
  loading: Loading
});

export default function LoadableCheckout(props) {
  return <LoadableComponent {...props} />;
}
