import React from 'react';
import Svg, {
	Defs,
	LinearGradient,
	Stop,
	Path,
	ClipPath,
	Use,
	G
} from 'react-native-svg';

export default function PlayBtnSvg(props: React.SVGProps<SVGSVGElement>) {
	return (
		<Svg viewBox="0 0 640 640" width={640} height={640} {...props}>
			<Defs>
				<LinearGradient
					id="prefix__b"
					gradientUnits="userSpaceOnUse"
					x1={112}
					y1={80}
					x2={524.8}
					y2={563.2}
				>
					<Stop offset="0%" stopColor="#471e73" stopOpacity={0.05} />
					<Stop offset="100%" stopColor="#eff8e2" />
				</LinearGradient>
				<LinearGradient
					id="prefix__g"
					gradientUnits="userSpaceOnUse"
					x1={526.59}
					y1={295}
					x2={200.61}
					y2={421.83}
				>
					<Stop offset="0%" stopColor="#eff8e2" />
					<Stop offset="21.446%" stopColor="#cecfc7" />
					<Stop offset="44.75%" stopColor="#ada8b6" />
					<Stop offset="71.292%" stopColor="#573280" />
					<Stop offset="100%" stopColor="#23022e" />
				</LinearGradient>
				<Path
					d="M640 320c0 176.61-143.39 320-320 320S0 496.61 0 320 143.39 0 320 0s320 143.39 320 320z"
					id="prefix__a"
				/>
				<Path
					d="M320 405.01L150 490V150l170 85 170 85-170 85.01z"
					id="prefix__f"
				/>
				<ClipPath id="prefix__c">
					<Use xlinkHref="#prefix__a" />
				</ClipPath>
			</Defs>
			<Use xlinkHref="#prefix__a" fill="url(#prefix__b)" />
			<G clipPath="url(#prefix__c)">
				<Use
					xlinkHref="#prefix__a"
					fillOpacity={0}
					stroke="#eff8e2"
					strokeWidth={40}
				/>
			</G>
			<Path
				d="M640 320c0 176.61-143.39 320-320 320S0 496.61 0 320 143.39 0 320 0s320 143.39 320 320z"
				fill="#fff"
				filter="url(#prefix__d)"
			/>
			<G>
				<Path
					d="M320 405.01L150 490V150l170 85 170 85-170 85.01z"
					fill="#fff"
					filter="url(#prefix__e)"
				/>
				<Use xlinkHref="#prefix__f" opacity={0.9} fill="url(#prefix__g)" />
			</G>
		</Svg>
	);
}
