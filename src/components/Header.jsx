import React, { useState, useEffect } from 'react';
import './Header.css';

export default function Header({ currentPage, navigate }) {
	const [scrolled, setScrolled] = useState(false);

	useEffect(() => {
		const onScroll = () => setScrolled(window.scrollY > 20);
		window.addEventListener('scroll', onScroll);
		return () => window.removeEventListener('scroll', onScroll);
	}, []);

	return (
		<header className={`site-header ${scrolled ? 'scrolled' : ''}`}>
			<div className="header-inner">
				{/* Logo / Brand */}
				<button className="header-logo" onClick={() => navigate('blog')}>
					<span className="logo-bracket">[</span>
					<span className="logo-name">0xT3nk3yyy</span>
					<span className="logo-bracket">]</span>
					<span className="logo-cursor">▌</span>
				</button>

				{/* Nav */}
				<nav className="header-nav">
					<button
						className={`nav-item ${currentPage === 'blog' || currentPage === 'post' ? 'active' : ''}`}
						onClick={() => navigate('blog')}
					>
						<span className="nav-icon">
							<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
								<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
								<polyline points="14 2 14 8 20 8" />
								<line x1="16" y1="13" x2="8" y2="13" />
								<line x1="16" y1="17" x2="8" y2="17" />
								<polyline points="10 9 9 9 8 9" />
							</svg>
						</span>
						Write-ups
					</button>

					<button
						className={`nav-item ${currentPage === 'portfolio' ? 'active' : ''}`}
						onClick={() => navigate('portfolio')}
					>
						<span className="nav-icon">
							<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
								<rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
								<line x1="8" y1="21" x2="16" y2="21" />
								<line x1="12" y1="17" x2="12" y2="21" />
							</svg>
						</span>
						Portfolio
					</button>
				</nav>

				{/* Right side: GitHub link */}
				<div className="header-right">
					<a
						href="https://github.com"
						target="_blank"
						rel="noopener noreferrer"
						className="header-github"
					>
						<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
							<path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
						</svg>
						GitHub
						<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="ext-icon">
							<line x1="7" y1="17" x2="17" y2="7" /><polyline points="7 7 17 7 17 17" />
						</svg>
					</a>
				</div>
			</div>
		</header>
	);
}
