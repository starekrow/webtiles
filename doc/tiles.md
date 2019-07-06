

## Rendering

The visuals for a webtile app are rendered as a collection of "tiles". Each 
tile may reference other tiles implicitly or explicitly, with the only 
constraint on those relationships being that the final result must satisfy the
definition of a Directed Acyclic Graph. That is, it must be possible to take any
path through the graph and reach a leaf node after a finite number of edge 
traversals.

The actual arrangement and complexity of the references is left entirely up to 
the application.





### Tile Attributes


The interpretation of tile attributes is highly dependent on the tile type, but
can be largely grouped into _visible_ and _non-visible_ categories.

All tiles that derive from `ui/display-node` have a common set of attributes 
that are loosely based on HTML and CSS naming conventions. Application 
developers should keep in mind that the set of possible display attributes can
be expected to increase over time, and avoid naming custom properties after
obvious visual concepts.

Basic Display Node Attributes:

#### align
#### alt-text
#### anchor
##### align-h
##### align-v
#### background
##### background-color
##### background-image
##### background-opacity
#### border
##### border-color
##### border-radius
##### border-left
##### border-type
##### border-width
##### ? border-opacity
##### ? color-tint
#### cursor
#### height
#### margin
#### opacity
#### padding
##### padding-left
##### padding-right
##### padding-top
##### padding-bottom
##### padding-outer
#### skin
#### tooltip
#### type
#### width

Inherited Display Node Attributes:

##### color
#### font
##### font-weight
##### font-decoration
##### font-style
##### font-size
##### Font Flags
###### +/- bold
###### +/- italic
###### +/- underline
###### +/- <size>
###### <size>
###### <name>
##### flow-align
##### flow-direction

Display Node Hooks:

#### on-mouseover
#### on-mouseout
#### on-touchstart
#### on-touchend
#### on-click
#### on-before-render
#### on-render
#### on-before-update
#### on-update

Placed Node Attributes:

#### x
#### y

Grouping Node Attributes:

#### children
#### flow

Flow Node Attributes:

#### break
##### margin-before
##### margin-after
##### padding-before
##### padding-after

Static node Attributes:

#### icon
#### image
#### html
#### markdown
#### markdown-bold
#### markdown-italic
#### markdown-code
#### markdown-header-N
#### markdown-blockquote
#### markdown-link
#### markdown-block
#### markdown-bullet
#### text

Viewport Node Attributes:

#### scroll-x

pixel position or "end" or "start"

#### canvas

#### content

For a `viewport` node, the `content` attribute can be a display node or a 
list of display nodes. The node(s) will be placed on a virtual canvas that the 
viewport can scroll over to show the contents of.

Content nodes have different defaults for the following attributes:

  * max-width - the max-width attribute of a content node starts as `100%`

Content child sizes are relative to the viewport node.

#### scroll-y
#### scroll-x-max
#### scroll-y-max
#### 





#### field



