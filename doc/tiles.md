

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

The assigned attributes are explained below.

#### anchor
#### background
#### border
#### break
#### color
#### children
#### field
#### flow
#### flow-align
#### flow-direction
#### font

flags:
##### +/- bold
##### +/- italic
##### +/- underline
##### +/- <size>
##### <size>
##### <name>

#### 
#### height
#### h-align
#### image
#### margin
#### opacity
#### padding
#### text
#### type
#### v-align
#### width
#### x
#### y
#### 
#### 
#### 
#### 
#### 
#### 
#### 
#### 
#### 
#### 
#### 







