import { mockedEditView } from "../../common/MockedEditView.Components";
import AccountsEditView from "../../../js/containers/entities/accounts/components/AccountsEditView";

describe("Virtual rendered AccountsEditView", () => {
  mockedEditView({
    entity: "Account",
    EditView: AccountsEditView,
    record: mockecApi => mockecApi.db.getAccount(1),
    render: (wrapper, initialValues) => {
      expect(wrapper.find("#accountCode input").val()).toContain(initialValues.accountCode);
      expect(wrapper.find("#type input").val()).toContain(initialValues.type.toString());
      expect(wrapper.find("#description input").val()).toContain(initialValues.description);
      expect(wrapper.find('input[type="checkbox"]').props().checked).toEqual(initialValues.isEnabled);
    }
  });
});
