import { getData } from './api.js';
import { showDataError } from './alert-manager.js';

const data = await getData().catch(showDataError);

export { data };
