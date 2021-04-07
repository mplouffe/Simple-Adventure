/* GridWorld_EnemyFactory
 * Generates enemies
 * Version: 0.1
 * Date Created: 04.06.2021
 * Last Update: 04.06.2021
 * Author: Matheu Plouffe
 * 
 * History:
 * 0.1 - Initial implementation
 */

class EnemyFactory {
    constructor() {
        var self = this;
        self.enemyBestiary = loadJSON("json/enemyBestiary.json");
        console.log(self.enemyBestiary);
    }

    getEnemy(id) {
        let enemy = self.enemyBestiary.enemies.find(enemy => enemy.id == id);
        console.log(enemy);
    }
}