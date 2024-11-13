/* eslint-disable @next/next/no-assign-module-variable */
/* eslint-disable @typescript-eslint/no-explicit-any */
// import { PlayPage } from '@/components/PlayPage/PlayPage';

// export default function Home() {
// 	return (
// 		<div>
// 			<PlayPage />
// 		</div>
// 	);
// }
'use client';

import { useEffect, useState } from 'react';
import { verifyTelegramUser, updateUserData } from '@/lib/api';

export default function HomePage() {
	const [userData, setUserData] = useState<any>(null);
	const [error, setError] = useState<string | null>(null);
	const [updateMessage, setUpdateMessage] = useState<string | null>(null);

	useEffect(() => {
		let WebApp;
		// Dynamically import @twa-dev/sdk inside useEffect
		const authenticateUser = async () => {
			try {
				// Import WebApp only on the client side
				const module = await import('@twa-dev/sdk');
				WebApp = module.default;

				// Now WebApp is defined, and we can use it safely
				if (WebApp.initData) {
					const data = await verifyTelegramUser(WebApp.initData);
					setUserData(data);
				}
			} catch (err: any) {
				setError(err.message);
			}
		};

		authenticateUser();
	}, []);

	const handleUpdateData = async () => {
		if (!userData) return;

		try {
			const module = await import('@twa-dev/sdk');
			const WebApp = module.default;

			if (WebApp.initData) {
				const updatedData = await updateUserData(
					userData.data.userId,
					{ currency: (userData.data.currency || 0) + 10 },
					WebApp.initData
				);
				setUpdateMessage(updatedData.message);

				// Refresh user data
				const refreshedData = await verifyTelegramUser(WebApp.initData);
				setUserData(refreshedData);
			}
		} catch (err: any) {
			setError(err.message);
		}
	};

	return (
		<div className="container">
			<h1>Welcome to Kitty Kombat!</h1>
			{error && <p className="error">{error}</p>}
			{updateMessage && <p className="success">{updateMessage}</p>}
			{userData && (
				<div>
					<h2>User Data:</h2>
					<pre>{JSON.stringify(userData.data, null, 2)}</pre>
					<button onClick={handleUpdateData} className="btn">
						Add 10 Currency
					</button>
				</div>
			)}
		</div>
	);
}
