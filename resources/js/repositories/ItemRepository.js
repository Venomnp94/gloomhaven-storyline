import Item from "../models/Item";
import GameData from "../services/GameData";

export default class ItemRepository {

    fetch(game) {
        return collect(this.gameData.items(game)).mapWithKeys((item) => {
            item = new Item(item, game);
            return [item.id, item];
        });
    }

    find(id) {
        // If id is numeric, prepend the current game
        if (!isNaN(id)) {
            id = app.game + '-' + id;
        }
        return app.items ? app.items.get(id) : null;
    }

    findMany(list) {
        return collect().wrap(list).mapWithKeys((id) => {
            return [id, this.find(id)];
        }).filter();
    }

    where(filter) {
        return app.items.filter(filter);
    }

    fromGame(game) {
        return this.where((item) => {
            return item.game === game;
        })
    }

    get gameData() {
        return this._gameData || (this._gameData = new GameData());
    }

}
