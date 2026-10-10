import React from 'react';

const Image = ({ src, alt, width, height, fill, className, priority, ...props }) => {
    const style = fill
        ? {
            position: 'absolute',
            height: '100%',
            width: '100%',
            left: 0,
            top: 0,
            right: 0,
            bottom: 0,
            objectFit: props.style?.objectFit || 'cover',
        }
        : {};

    return (
        <img
            src={src}
            alt={alt}
            width={width}
            height={height}
            className={className}
            style={{ ...style, ...props.style }}
            loading={priority ? 'eager' : 'lazy'}
            decoding={priority ? 'sync' : 'async'}
            fetchPriority={priority ? 'high' : 'auto'}
            {...props}
        />
    );
};

export default Image;
