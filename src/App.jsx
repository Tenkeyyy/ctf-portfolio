import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import DarkVeil from './components/DarkVeil';
import BlogList from './pages/BlogList';
import BlogPost from './pages/BlogPost';
import Portfolio from './pages/Portfolio';
import './App.css';

function Layout() {
	const location = useLocation();

	return (
		<div className="app-root">
			{/* Background layer */}
			<div className="bg-veil">
				<DarkVeil
					hueShift={-20}
					noiseIntensity={0.1}
					scanlineIntensity={0.15}
					speed={0.5}
					scanlineFrequency={29}
					warpAmount={0}
					resolutionScale={1}
				/>
			</div>

			{/* Content layer */}
			<div className="app-content">
				<Header />

				<main className="main-wrapper">
					<Routes>
						<Route path="/" element={<BlogList />} />
						<Route path="/writeups/:slug" element={<BlogPost />} />
						<Route path="/portfolio" element={<Portfolio />} />
						{/* Catch-all → home */}
						<Route path="*" element={<BlogList />} />
					</Routes>
				</main>
			</div>
		</div>
	);
}

export default function App() {
	return (
		<BrowserRouter>
			<Layout />
		</BrowserRouter>
	);
}
