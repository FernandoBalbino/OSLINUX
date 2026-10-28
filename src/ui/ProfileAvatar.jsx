import React from 'react';
import {avatarById} from '../core/profile.js';
import {Icon} from './Icon.jsx';
export function ProfileAvatar({profile,size=64}){const avatar=avatarById(profile?.avatar);return <span className="profile-avatar" style={{width:size,height:size}}>{avatar?<img src={avatar.src} alt={'Avatar '+avatar.name}/>:<Icon name="avatar-default" size={Math.round(size*.54)}/>}</span>;}
