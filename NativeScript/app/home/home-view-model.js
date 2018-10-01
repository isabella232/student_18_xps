const Observable = require("data/observable");

const SelectedPageService = require("../shared/selected-page-service");

function HomeViewModel() {
    SelectedPageService.getInstance().updateSelectedPage("Home");
    const viewModel = Observable.fromObjectRecursive({
        isServerEmpty: true,
        server: undefined
    });

    return viewModel;
}

module.exports = HomeViewModel;
