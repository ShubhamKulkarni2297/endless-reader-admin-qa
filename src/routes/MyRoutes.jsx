import { lazy } from "react";
import AddLevel from "../sections/Levels/AddLevel";
import AddChapters from "../sections/Chapters/addChapters";
import UserDeviceList from "../sections/User-Devices/userDeviceList";
const ChaptersList = lazy(() => import("../sections/Chapters/ChaptersList"));
const LevelsList = lazy(() => import("../sections/Levels/LevelsList"));
const Dashboards = lazy(() => import("../sections/Dashboards/Dashboards"));

const SignInPage = lazy(() => import("../sections/Authentications/SignInPage"));
const SignUpPage = lazy(() => import("../sections/Authentications/SignUpPage"));



const publicRoutes = [
	{ path: '/signin', component: <SignInPage /> },
	{ path: '/signup', component: <SignUpPage /> },
];
const protectedRoutes = [
	// { path: '/', component: <Dashboards /> },
	{ path: '/dashboards', component: <Dashboards /> },
	{ path: '/chapters', component: <ChaptersList /> },
	{ path: '/chapters/add', component: <AddChapters /> },
	{ path: '/levels', component: <LevelsList /> },
	{ path: '/levels/addlevel', component: <AddLevel /> },
	{ path: '/levels/addlevel/:id', component: <AddLevel /> },
	{ path: '/user-device', component: <UserDeviceList /> },
];

export { publicRoutes, protectedRoutes };