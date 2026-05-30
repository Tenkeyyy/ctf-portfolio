import React, { useState, useEffect, } from 'react';
import Header from './components/Header';
import DarkVeil from './components/DarkVeil';
import BlogList from './pages/BlogList';
import BlogPost from './pages/BlogPost';
import Portfolio from './pages/Portfolio';
import './App.css';


export default function App() {
	const [page, setPage] = useState('blog'); // 'blog' | 'portfolio' | 'post'
	const [selectedPost, setSelectedPost] = useState(null);

	const navigate = (target, data = null) => {
		setPage(target);
		if (data) setSelectedPost(data);
		window.scrollTo(0, 0);
	};

	return (
		<div className="app-root">
			{/* Background layer */}
			<div className="bg-veil">
				<DarkVeil
					hueShift={-20}
					noiseIntensity={0.05}
					scanlineIntensity={0.15}
					speed={0.5}
					scanlineFrequency={29}
					warpAmount={0}
					resolutionScale={1}
				/>
			</div>

			{/* Content layer */}
			<div className="app-content">
				<Header currentPage={page} navigate={navigate} />

				<main className="main-wrapper">
					{page === 'blog' && (
						<BlogList navigate={navigate} />
					)}
					{page === 'post' && selectedPost && (
						<BlogPost post={selectedPost} navigate={navigate} />
					)}
					{page === 'portfolio' && (
						<Portfolio />
					)}
				</main>
			</div>
		</div>
	);
}
