const Observable = require("data/observable");

const SelectedPageService = require("../shared/selected-page-service");

function HomeViewModel() {
    SelectedPageService.getInstance().updateSelectedPage("Home");
    let server;
    const viewModel = Observable.fromObjectRecursive({
        server: server
    });

    return viewModel;
}

module.exports = HomeViewModel;
