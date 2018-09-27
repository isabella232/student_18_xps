const observableModule = require("data/observable");
const ObservableArrayModule = require("data/observable-array");

const SelectedPageService = require("../shared/selected-page-service");

function HomeViewModel() {
    SelectedPageService.getInstance().updateSelectedPage("Home");
    // Some examples conodes to display
    const conodes = [
        { name: "Conode 1" },
        { name: "Conode 2" },
        { name: "Conode 3" }
    ];
    const viewModel = observableModule.fromObject({
        conodes: new ObservableArrayModule.ObservableArray(conodes)
    });

    return viewModel;
}

module.exports = HomeViewModel;
