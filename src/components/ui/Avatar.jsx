import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { getInitials } from '../../utils';

const Avatar = ({
  src,
  alt = '',
  size = 'medium',
  shape = 'circle',
  className = '',
  onClick,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium text-white bg-gray-400 overflow-hidden';

  const sizes = {
    small: 'w-8 h-8 text-sm',
    medium: 'w-10 h-10 text-base',
    large: 'w-12 h-12 text-lg',
  };

  const shapes = {
    circle: 'rounded-full',
    square: 'rounded-md',
  };

  const initials = alt ? getInitials(alt) : '';

  return (
    <div
      className={clsx(
        baseStyles,
        sizes[size],
        shapes[shape],
        onClick && 'cursor-pointer',
        className
      )}
      onClick={onClick}
      {...props}
    >
      {src ? (
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover"
        />
      ) : (
        <span>{initials}</span>
      )}
    </div>
  );
};

Avatar.propTypes = {
  src: PropTypes.string,
  alt: PropTypes.string,
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  shape: PropTypes.oneOf(['circle', 'square']),
  className: PropTypes.string,
  onClick: PropTypes.func,
};

export default Avatar;