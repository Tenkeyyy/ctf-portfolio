import React, { useState, useEffect } from 'react';
import BorderGlow from '../components/BorderGlow';
import { PROJECTS, SKILLS, ACHIEVEMENTS } from '../data/mockData';
import { getPosts, getProfile } from '../data/mockData';
import './Portfolio.css';

const LANG_COLORS = {
	Python: '#3776ab',
	Go: '#00add8',
	C: '#555599',
	Markdown: '#4a90d9',
	Rust: '#dea584',
	JS: '#f7df1e',
};

export default function Portfolio() {
	const [PROFILE, setProfile] = useState(null);
	useEffect(() => {
		async function fetchData() {
			try {
				const profileRes = await getProfile()
				const profileData = await profileRes.json();
				setProfile(profileData);
			} catch (err) {
				console.error(err);
				setError(err.message);
			} finally {
				setLoading(false);
			}
		}
		fetchData();
	}, []);

	if (!PROFILE)
		return (
			<div>
				<p>
					waiting
				</p>
			</div>
		)

	return (
		<div className="portfolio fade-up">
			{/* ── Hero ─────────────────────────────────────────────── */}
			<BorderGlow
				edgeSensitivity={30}
				backgroundColor="#1a1625"
				borderRadius={20}
				glowRadius={50}
				glowIntensity={1}
				colors={['#c084fc', '#f472b6', '#38bdf8']}
				className="portfolio-hero-wrap fade-up fade-up-1"
			>
				<div className="portfolio-hero">
					{/* Terminal badge */}
					<div className="hero-terminal">
						<span className="term-prompt">~/</span>
						<span className="term-cmd">whoami</span>
					</div>

					<div className="hero-body">
						<div className="hero-avatar-col">
							<div className="hero-avatar">
								{PROFILE.avatar ? (
									<img src={PROFILE.avatar} alt={PROFILE.name} />
								) : (
									<div className="hero-avatar-ph">
										<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
											<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
											<circle cx="12" cy="7" r="4" />
										</svg>
									</div>
								)}
							</div>
							<div className="hero-status">
								<span className="status-dot" />
								Available for CTF collabs
							</div>
						</div>

						<div className="hero-text-col">
							<h1 className="hero-name">{PROFILE.fullName}</h1>
							<p className="hero-handle">@{PROFILE.name}</p>
							<p className="hero-bio">{PROFILE.bio}</p>

							<div className="hero-links">
								<a href={PROFILE.github} target="_blank" rel="noopener noreferrer" className="hero-link link-github">
									<svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
										<path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
									</svg>
									GitHub
								</a>
								{PROFILE.ctftime && (
									<a href={PROFILE.ctftime} target="_blank" rel="noopener noreferrer" className="hero-link link-ctftime">
										<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
											<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
										</svg>
										CTFtime
									</a>
								)}
							</div>
						</div>
					</div>
				</div>
			</BorderGlow>

			<div className="portfolio-grid">
				{/* ── Skills ─────────────────────────────────────────── */}
				<BorderGlow
					edgeSensitivity={28}
					backgroundColor="#1a1625"
					borderRadius={16}
					glowRadius={35}
					glowIntensity={0.85}
					colors={['#c084fc', '#f472b6', '#38bdf8']}
					className="skills-wrap fade-up fade-up-2"
				>
					<div className="skills-card">
						<h2 className="card-title">
							<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
								<polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
							</svg>
							Skills
						</h2>
						<div className="skills-list">
							{SKILLS.map(s => (
								<div key={s.label} className="skill-item">
									<div className="skill-label-row">
										<span className="skill-label">{s.label}</span>
										<span className="skill-pct">{s.level}%</span>
									</div>
									<div className="skill-bar-bg">
										<div
											className="skill-bar-fill"
											style={{ width: `${s.level}%` }}
										/>
									</div>
								</div>
							))}
						</div>
					</div>
				</BorderGlow>

				{/* ── Achievements ───────────────────────────────────── */}
				<BorderGlow
					edgeSensitivity={28}
					backgroundColor="#1a1625"
					borderRadius={16}
					glowRadius={35}
					glowIntensity={0.85}
					colors={['#f472b6', '#c084fc', '#38bdf8']}
					className="achievements-wrap fade-up fade-up-3"
				>
					<div className="achievements-card">
						<h2 className="card-title">
							<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
								<circle cx="12" cy="8" r="6" /><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11" />
							</svg>
							CTF Achievements
						</h2>
						<div className="achievements-list">
							{ACHIEVEMENTS.map((a, i) => (
								<div key={i} className="achievement-item">
									<div className="achievement-rank">
										<span className="rank-label">#{i + 1}</span>
									</div>
									<div className="achievement-info">
										<span className="achievement-event">{a.event}</span>
										<span className="achievement-placement">{a.placement}</span>
									</div>
									<span className="achievement-year">{a.year}</span>
								</div>
							))}
						</div>
					</div>
				</BorderGlow>
			</div>

			{/* ── Projects ───────────────────────────────────────────── */}
			<div className="section-label fade-up fade-up-3">
				<h2 className="section-title-sm">
					<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
						<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />
					</svg>
					Projects
				</h2>
			</div>

			<div className="projects-grid">
				{PROJECTS.map((p, i) => (
					<BorderGlow
						key={p.id}
						edgeSensitivity={28}
						backgroundColor="#1a1625"
						borderRadius={14}
						glowRadius={32}
						glowIntensity={0.8}
						colors={['#c084fc', '#f472b6', '#38bdf8']}
						className={`project-card-wrap fade-up fade-up-${Math.min(i + 4, 6)}`}
					>
						<div className="project-card">
							<div className="project-top">
								<div className="project-icon">
									<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
										<path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
									</svg>
								</div>
								<a href={p.github} target="_blank" rel="noopener noreferrer" className="project-github-link">
									<svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
										<path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
									</svg>
								</a>
							</div>

							<h3 className="project-name">{p.name}</h3>
							<p className="project-desc">{p.description}</p>

							<div className="project-footer">
								<div className="project-tags">
									{p.tags.map(t => (
										<span key={t} className="project-tag">{t}</span>
									))}
								</div>
								<div className="project-meta">
									{p.lang && (
										<span className="project-lang">
											<span
												className="lang-dot"
												style={{ background: LANG_COLORS[p.lang] || '#888' }}
											/>
											{p.lang}
										</span>
									)}
									<span className="project-stars">
										<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
											<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
										</svg>
										{p.stars}
									</span>
								</div>
							</div>
						</div>
					</BorderGlow>
				))}
			</div>
		</div>
	);
}
