import { getNewsList } from "../controller/home";

export const ROUTES = [
    {
        method: 'get',
        path: '/news',
        handler: getNewsList,
    },
];
