import {writable} from 'svelte/store'

export const Networks = writable([]);

export const Stations_by_Networks = writable([]);

export const all_datas = writable([]);

export const station = writable(null);

export const stations_for_maps = writable([]);