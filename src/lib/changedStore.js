// @ts-nocheck
import { get, writable } from "svelte/store";

export const changed = writable(false);

export const couting_signal = writable(0);