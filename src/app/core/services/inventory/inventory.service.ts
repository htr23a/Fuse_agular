import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import Item, {ItemInventory} from "../../models/item";
import {map} from "rxjs";
import {environment} from "../../../../environments/environment";

@Injectable({
    providedIn:'root'
})
export class InventoryService{
    public static KEY = 'TS_COMPANY_SETTINGS';
    constructor(private http: HttpClient) {
    }
    getInventoryByDefaultRoom(items?: Item[]) {

        const roomId = this.getDefaultRoomId();
        if (roomId) {
            return this.getInventoryByRoom(roomId, items);
        }
        else {
            return Promise.reject({error: 'DEFAULT_ROOM_NOT_FOUND'});
        }
    }

    getDefaultRoomId = () => {
        const settings = JSON.parse(sessionStorage.getItem('TS_COMPANY_SETTINGS'));
        if (settings && settings['default_inventory_room']) {
            return +settings['default_inventory_room'];
        }

        return 0;
    };

    getInventoryByRoom(room_id: number, items?: Item[]) {
        const url = [environment.apiGrv, 'inventory', 'room', room_id].join('/');
        return this.http.get<ItemInventory[]>(url)
            .pipe(
                map(inventories => {
                    if (items) {
                        this.mapInventoriesToItems(inventories, items);
                        console.log(items)
                    }
                    return inventories;
                })
            )
            .toPromise();
    }

    private mapInventoriesToItems(inventories: ItemInventory[], items: Item[]) {
        items.length = 0;
        if (inventories) {
            for (let inventory of inventories) {
                const value = {
                    unit_id: inventory.unit_id,
                    InventoryStorage: inventory.InventoryStorage,
                    ItemUnit: inventory.ItemUnit,
                    quantity: inventory.quantity,
                };

                const find = items.find(
                    (item) => item.id === inventory.Item.id
                );

                if (find) {
                    find.Inventories.push(value);

                    for (let inv of find.Inventories) {
                        if (inv.quantity > 0) {
                            find.available = inv;
                            break;
                        }
                    }
                } else {
                    let inv = {
                        ...inventory.Item,
                        available: value,
                        Inventories: [value],
                    };

                    items.push(inv);
                }
            }
        }
    }
}
