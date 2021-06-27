import { useEffect, useState } from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Saved } from './components/Saved';
import { Search } from './components/Search';
import './App.css';

function App() {
	return (
		<BrowserRouter>
			<Navbar />
			<Switch>
				<Route path="/search" exact>
					<Search />
				</Route>
				<Route path="/saved" exact>
					<Saved />
				</Route>
				<Route path="/">
					<Redirect to="/search" />
				</Route>
			</Switch>
		</BrowserRouter>
	);
}

export default App;
