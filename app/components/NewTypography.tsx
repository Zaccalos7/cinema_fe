export interface NewTypographyProps {
  variant?:
    | 'h1'
    | 'h2'
    | 'h3'
    | 'h4'
    | 'h5'
    | 'h6'
    | 'body1'
    | 'body2'
    | 'body3'
    | 'caption'
    | 'p'
    | 'blockquote'
    | 'inlineCode'
    | 'lead'
    | 'large'
    | 'small'
    | 'muted'
    | 'custom'
}

const wrapperJsx: {
  [key: string]: React.FC<any>
} = {}

const NewTypography = ({variant = 'body2'}: NewTypographyProps) => {
  return wrapperJsx[variant]({})
}

export default NewTypography
