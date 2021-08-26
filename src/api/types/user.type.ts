export type User = {
	displayName: string;
	url: string;
	_links: UserAvatar;
	id: string;
	uniqueName: string;
	imageUrl: string;
	descriptor: string;
};

export type UserAvatar = {
	avatar: { href: string };
};
