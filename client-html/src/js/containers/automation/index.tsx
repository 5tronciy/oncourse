import * as React from "react";
import Loadable from "@react-loadable/revised";
import Loading from "../../common/components/layout/Loading";

const LoadableComponent = Loadable({
  loader: () => import(/* webpackChunkName: "automation" */ "./Automation"),
  loading: Loading
});

const LoadableScripts = props => <LoadableComponent {...props} />;

export default LoadableScripts;
