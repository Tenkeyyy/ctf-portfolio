import React, { useState, useEffect } from 'react';
import BorderGlow from '../components/BorderGlow';
import './BlogList.css';
import { getPosts, getProfile } from '../data/mockData';

const CATEGORIES = ['all', 'pwn', 'web', 'crypto', 'rev', 'forensics', 'misc'];

function formatDate(dateStr) {
	const d = new Date(dateStr);
	const now = new Date();
	const diffDays = Math.floor((now - d) / 86400000);
	if (diffDays === 0) return 'today';
	if (diffDays === 1) return '1 day ago';
	if (diffDays < 30) return `${diffDays} days ago`;
	if (diffDays < 365) return `${Math.floor(diffDays / 30)}mo ago`;
	return `${Math.floor(diffDays / 365)}y ago`;
}

/* ─── Skeleton pulse blocks ─────────────────────────────── */
function Skeleton({ width = '100%', height = '14px', radius = '6px', style = {} }) {
	return (
		<div
			className="skeleton"
			style={{ width, height, borderRadius: radius, ...style }}
		/>
	);
}

function ProfileSkeleton() {
	return (
		<div className="profile-card skeleton-card">
			<Skeleton width="80px" height="80px" radius="14px" style={{ flexShrink: 0 }} />
			<div className="skeleton-info">
				<Skeleton width="160px" height="20px" radius="6px" />
				<Skeleton width="100%" height="13px" radius="5px" style={{ marginTop: 10 }} />
				<Skeleton width="80%" height="13px" radius="5px" style={{ marginTop: 6 }} />
				<div style={{ display: 'flex', gap: 16, marginTop: 14 }}>
					<Skeleton width="90px" height="12px" radius="4px" />
					<Skeleton width="70px" height="12px" radius="4px" />
					<Skeleton width="80px" height="12px" radius="4px" />
				</div>
			</div>
		</div>
	);
}

function PostCardSkeleton() {
	return (
		<div className="post-card-skeleton">
			<div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
				<Skeleton width="75%" height="14px" radius="5px" />
				<Skeleton width="50px" height="11px" radius="4px" />
			</div>
			<Skeleton width="100%" height="12px" radius="4px" style={{ marginBottom: 5 }} />
			<Skeleton width="88%" height="12px" radius="4px" style={{ marginBottom: 14 }} />
			<div style={{ display: 'flex', gap: 8 }}>
				<Skeleton width="44px" height="20px" radius="100px" />
				<Skeleton width="52px" height="20px" radius="100px" />
			</div>
		</div>
	);
}

/* ─── Main component ────────────────────────────────────── */
export default function BlogList({ navigate }) {
	const [posts, setPosts] = useState([]);
	const [profile, setProfile] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [search, setSearch] = useState('');
	const [category, setCategory] = useState('all');

	useEffect(() => {
		async function fetchData() {
			try {
				const [postsRes, profileRes] = await Promise.all([
					getPosts(),
					getProfile(),
				]);
				if (!postsRes.ok || !profileRes.ok) throw new Error('Server error');
				const [postsData, profileData] = await Promise.all([
					postsRes.json(),
					profileRes.json(),
				]);
				setPosts(postsData);
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

	const filtered = posts.filter(p => {
		const matchCat = category === 'all' || p.category === category;
		const q = search.toLowerCase();
		const matchSearch = !q
			|| p.title.toLowerCase().includes(q)
			|| p.excerpt.toLowerCase().includes(q)
			|| (p.ctf && p.ctf.toLowerCase().includes(q));
		return matchCat && matchSearch;
	});

	return (
		<div className="bloglist fade-up">

			{/* ── Profile Card ──────────────────────────────────────── */}
			{loading ? (
				<div className="profile-glow-wrap">
					<ProfileSkeleton />
				</div>
			) : error ? (
				<ErrorBanner message={error} />
			) : profile ? (
				<ProfileCard profile={profile} postCount={posts.length} />
			) : null}

			{/* ── Blog header ───────────────────────────────────────── */}
			<div className="section-header fade-up fade-up-2">
				<div className="section-title-row">
					<h2 className="section-title">Write-ups</h2>
					<span className="post-count">
						{loading ? '—' : `${filtered.length} post${filtered.length !== 1 ? 's' : ''}`}
					</span>
				</div>

				<div className="search-wrap">
					<svg className="search-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
						<circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
					</svg>
					<input
						className="search-input"
						type="text"
						placeholder="Search write-ups…"
						value={search}
						onChange={e => setSearch(e.target.value)}
					/>
				</div>

				<div className="category-filter">
					{CATEGORIES.map(cat => (
						<button
							key={cat}
							className={`cat-btn ${category === cat ? 'active' : ''}`}
							onClick={() => setCategory(cat)}
						>
							{cat === 'all' ? 'All' : cat.toUpperCase()}
						</button>
					))}
				</div>
			</div>

			{/* ── Post grid ─────────────────────────────────────────── */}
			{loading ? (
				<div className="post-grid">
					{Array.from({ length: 6 }).map((_, i) => (
						<PostCardSkeleton key={i} />
					))}
				</div>
			) : filtered.length === 0 ? (
				<div className="empty-state fade-up fade-up-3">
					<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
						<circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
					</svg>
					No write-ups match your search.
				</div>
			) : (
				<div className="post-grid">
					{filtered.map((post, i) => (
						<PostCard
							key={post._id || post.id || post.slug}
							post={post}
							navigate={navigate}
							delay={i + 3}
						/>
					))}
				</div>
			)}
		</div>
	);
}

/* ─── Profile Card ──────────────────────────────────────── */
function ProfileCard({ profile, postCount }) {
	return (
		<BorderGlow
			edgeSensitivity={40}
			backgroundColor="#1a1625"
			borderRadius={20}
			glowRadius={55}
			glowIntensity={1}
			colors={['#c084fc', '#f472b6', '#38bdf8']}
			className="profile-glow-wrap fade-up fade-up-1"
		>
			<div className="profile-card">
				{/* Left: avatar + status */}
				<div className="profile-left">
					<div className="profile-avatar">
						{profile.avatar ? (
							<img src={profile.avatar} alt={profile.name} />
						) : (
							<div className="avatar-initials">
								{(profile.fullName || profile.name || '?')
									.split(' ')
									.map(w => w[0])
									.slice(0, 2)
									.join('')
									.toUpperCase()}
							</div>
						)}
						<span className="avatar-online" title="Open to collabs" />
					</div>

					{/* Stat pills */}
					<div className="profile-stat-pills">
						<div className="stat-pill">
							<span className="stat-value">{postCount}</span>
							<span className="stat-label">posts</span>
						</div>
						{profile.rank && (
							<div className="stat-pill">
								<span className="stat-value">{profile.rank}</span>
								<span className="stat-label">rank</span>
							</div>
						)}
						{profile.solves && (
							<div className="stat-pill">
								<span className="stat-value">{profile.solves}</span>
								<span className="stat-label">solves</span>
							</div>
						)}
					</div>
				</div>

				{/* Right: info */}
				<div className="profile-info">
					{/* Name row */}
					<div className="profile-name-row">
						<div>
							<h1 className="profile-name">{profile.fullName || profile.name}</h1>
							<p className="profile-handle">
								<span className="handle-at">@</span>{profile.name}
								{profile.team && (
									<span className="profile-team-badge">{profile.team}</span>
								)}
							</p>
						</div>
						<div className="profile-links">
							{profile.github && (
								<a href={profile.github} target="_blank" rel="noopener noreferrer" className="profile-icon-link" title="GitHub">
									<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
										<path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
									</svg>
								</a>
							)}
							{profile.ctftime && (
								<a href={profile.ctftime} target="_blank" rel="noopener noreferrer" className="profile-icon-link" title="CTFtime">
									<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
										<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
									</svg>
								</a>
							)}
							{profile.twitter && (
								<a href={profile.twitter} target="_blank" rel="noopener noreferrer" className="profile-icon-link" title="Twitter / X">
									<svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
										<path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
									</svg>
								</a>
							)}
						</div>
					</div>

					{/* Bio */}
					<p className="profile-bio">{profile.bio}</p>

					{/* Tags / specialties */}
					{profile.specialties && profile.specialties.length > 0 && (
						<div className="profile-specialties">
							{profile.specialties.map(s => (
								<span key={s} className={`tag tag-${s.toLowerCase()}`}>{s}</span>
							))}
						</div>
					)}
				</div>
			</div>
		</BorderGlow>
	);
}

/* ─── Error banner ──────────────────────────────────────── */
function ErrorBanner({ message }) {
	return (
		<div className="error-banner">
			<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
				<circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
			</svg>
			Failed to load data — {message}
		</div>
	);
}

/* ─── Post Card ─────────────────────────────────────────── */
function PostCard({ post, navigate, delay }) {
	return (
		<BorderGlow
			edgeSensitivity={36}
			backgroundColor="#1a1625"
			borderRadius={14}
			glowRadius={40}
			glowIntensity={0.9}
			colors={['#c084fc', '#f472b6', '#38bdf8']}
			className={`post-card-wrap fade-up fade-up-${Math.min(delay, 6)}`}
		>
			<button
				className="post-card"
				onClick={() => navigate('post', post)}
			>
				<div className="post-card-top">
					<h3 className="post-title">{post.title}</h3>
					<span className="post-date">{formatDate(post.date)}</span>
				</div>
				<p className="post-excerpt">{post.excerpt}</p>
				<div className="post-card-footer">
					<span className={`tag tag-${post.category}`}>{post.category.toUpperCase()}</span>
					<span className={`difficulty difficulty-${post.difficulty}`}>
						{post.difficulty.charAt(0).toUpperCase() + post.difficulty.slice(1)}
					</span>
					<span className="post-ctf">{post.ctf}</span>
					{post.points && (
						<span className="post-points">{post.points}pts</span>
					)}
				</div>
			</button>
		</BorderGlow>
	);
}
