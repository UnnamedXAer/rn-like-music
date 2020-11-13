import TrackPlayer, { Capability, RatingType } from 'react-native-track-player';

export const trackPlayerInit = async () => {
	await TrackPlayer.setupPlayer({});
	TrackPlayer.updateOptions({
		// One of RATING_HEART, RATING_THUMBS_UP_DOWN, RATING_3_STARS, RATING_4_STARS, RATING_5_STARS, RATING_PERCENTAGE
		ratingType: RatingType.FiveStars,

		// Whether the player should stop running when the app is closed on Android
		stopWithApp: false,

		// An array of media controls capabilities
		// Can contain CAPABILITY_PLAY, CAPABILITY_PAUSE, CAPABILITY_STOP, CAPABILITY_SEEK_TO,
		// CAPABILITY_SKIP_TO_NEXT, CAPABILITY_SKIP_TO_PREVIOUS, CAPABILITY_SET_RATING
		capabilities: [Capability.Play, Capability.Pause, Capability.Stop],

		// An array of capabilities that will show up when the notification is in the compact form on Android
		compactCapabilities: [Capability.Play, Capability.Pause],

		// Icons for the notification on Android (if you don't like the default ones)
		// playIcon: require('./play-icon.png'),
		// pauseIcon: require('./pause-icon.png'),
		// stopIcon: require('./stop-icon.png'),
		// previousIcon: require('./previous-icon.png'),
		// nextIcon: require('./next-icon.png'),
		// icon: require('./notification-icon.png'), // The notification icon
	});
};
