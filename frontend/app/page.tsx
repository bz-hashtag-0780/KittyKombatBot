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
import WebApp from '@twa-dev/sdk';
import { verifyTelegramUser, updateUserData } from '@/lib/api';

export default function HomePage() {
	const [userData, setUserData] = useState<any>(null);
	const [error, setError] = useState<string | null>(null);
	const [updateMessage, setUpdateMessage] = useState<string | null>(null);

	useEffect(() => {
		// Check if the code is running in the browser
		if (typeof window !== 'undefined') {
			const authenticateUser = async () => {
				try {
					if (WebApp.initData) {
						const data = await verifyTelegramUser(WebApp.initData);
						setUserData(data); // Store user data if authenticated
					}
				} catch (err: any) {
					setError(err.message);
				}
			};

			authenticateUser();
		}
	}, []);

	const handleUpdateData = async () => {
		if (!userData || !WebApp.initData) return;

		try {
			// Send initData with the update request for authentication
			const updatedData = await updateUserData(
				userData.data.userId,
				{
					currency: (userData.data.currency || 0) + 10, // Increment currency by 10
				},
				WebApp.initData
			);
			setUpdateMessage(updatedData.message);

			// Refresh user data to show the updated currency
			const refreshedData = await verifyTelegramUser(WebApp.initData);
			setUserData(refreshedData);
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
