import UiPlugin from './modules/ui/ui.plugin.ts';
import InfoPlugin from './modules/info/info.plugin.ts';
import LearningPlugin from './modules/learning/learning.plugin.ts';
import PatientsPlugin from './modules/patients/patients.plugin.ts';
import StoragePlugin from './modules/storage/storage.plugin.ts';

export default {
    plugins: [
        {
            pluginConstructor: UiPlugin
        },
        {
            pluginConstructor: InfoPlugin
        }
        ,
        {
            pluginConstructor: LearningPlugin
        }
        ,
        {
            pluginConstructor: PatientsPlugin
        }
        ,
        {
            pluginConstructor: StoragePlugin
        }
    ]
}
