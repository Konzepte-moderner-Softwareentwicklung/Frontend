import React from 'react';

export const Button = ({ children, onClick, disabled, className, ...props }: any) => 
  <button 
    onClick={onClick} 
    disabled={disabled} 
    className={className}
    {...props}
  >
    {children}
  </button>;

export const Input = ({ onChange, placeholder, type, value, ...props }: any) => 
  <input 
    onChange={onChange}
    placeholder={placeholder}
    type={type}
    value={value}
    {...props}
  />;

export const Card = ({ children, className, onClick, ...props }: any) => 
  <div className={className} onClick={onClick} {...props}>
    {children}
  </div>;

export const CardContent = ({ children, className, ...props }: any) => 
  <div className={className} {...props}>
    {children}
  </div>;

export const Dialog = ({ children, ...props }: any) => 
  <div {...props}>{children}</div>;

export const DialogTrigger = ({ children, asChild, ...props }: any) => 
  <div {...props}>{children}</div>;

export const DialogContent = ({ children, className, ...props }: any) => 
  <div className={className} {...props}>{children}</div>;

export const DialogHeader = ({ children, ...props }: any) => 
  <div {...props}>{children}</div>;

export const DialogTitle = ({ children, ...props }: any) => 
  <h2 {...props}>{children}</h2>;

export const DialogDescription = ({ children, ...props }: any) => 
  <p {...props}>{children}</p>;

export const DialogFooter = ({ children, ...props }: any) => 
  <div {...props}>{children}</div>;

export const Textarea = ({ onChange, placeholder, value, ...props }: any) => 
  <textarea 
    onChange={onChange}
    placeholder={placeholder}
    value={value}
    {...props}
  />;

export const Select = ({ children, onValueChange, ...props }: any) => 
  <div {...props}>
    {React.cloneElement(children, { onValueChange })}
  </div>;

export const SelectTrigger = ({ children, ...props }: any) => 
  <div {...props} role="button">
    {children}
  </div>;

export const SelectValue = ({ placeholder, ...props }: any) => 
  <span {...props}>{placeholder}</span>;

export const SelectContent = ({ children, ...props }: any) => 
  <div {...props}>{children}</div>;

export const SelectItem = ({ children, value, onSelect, ...props }: any) => 
  <div 
    {...props} 
    role="option"
    onClick={() => onSelect && onSelect(value)}
    data-value={value}
  >
    {children}
  </div>;

export const Slider = ({ onValueChange, defaultValue, max, step, ...props }: any) => 
  <input 
    type="range"
    defaultValue={defaultValue?.[0]}
    max={max}
    step={step}
    onChange={(e) => onValueChange?.([parseInt(e.target.value)])}
    {...props}
  />;

export const Pagination = ({ children, className, ...props }: any) => 
  <div className={className} {...props}>{children}</div>;

export const PaginationItem = ({ children, ...props }: any) => 
  <div {...props}>{children}</div>;

export const PaginationLink = ({ children, onClick, isActive, ...props }: any) => 
  <button 
    onClick={onClick}
    className={isActive ? 'active' : ''}
    {...props}
  >
    {children}
  </button>;

export const PaginationPrevious = ({ children, onClick, className, ...props }: any) => 
  <button 
    onClick={onClick}
    className={className}
    {...props}
  >
    {children}
  </button>;

export const PaginationNext = ({ children, onClick, className, ...props }: any) => 
  <button 
    onClick={onClick}
    className={className}
    {...props}
  >
    {children}
  </button>;