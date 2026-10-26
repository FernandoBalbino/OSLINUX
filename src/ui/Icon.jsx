import React from 'react';
export function Icon({name,size=16,className='',...props}) { return <span aria-hidden="true" className={'symbol '+className} style={{width:size,height:size,maskImage:`url(assets/symbolic/${name}.svg)`,WebkitMaskImage:`url(assets/symbolic/${name}.svg)`}} {...props}/>; }
export function Tool({icon,label,onClick,disabled=false,children,...props}) { return <button type="button" className="tool" title={label} aria-label={label} onClick={onClick} disabled={disabled} {...props}>{icon&&<Icon name={icon}/>} {children}</button>; }
