import {spotify, local} from "./environment.local";

export const environment = {
    ...spotify,
    LOCAL_API_URL: 'http://localhost:3000/api'
};
