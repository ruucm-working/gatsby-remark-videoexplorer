const { createFilePath } = require("gatsby-source-filesystem")
const path = require("path")
const slash = require(`slash`)

exports.createPages = ({ graphql, actions }) => {
  const { createPage } = actions

  const blogPostTemplate = path.resolve(`src/templates/template-blog-post.js`)
  return graphql(
    `
      {
        allMdx(limit: 1000, filter: { frontmatter: { draft: { ne: true } } }) {
          edges {
            node {
              fields {
                slug
              }
              frontmatter {
                tags
              }
            }
          }
        }
      }
    `
  ).then(result => {
    if (result.errors) {
      throw result.errors
    }
    // Create blog posts pages.
    result.data.allMdx.edges.forEach(edge => {
      createPage({
        path: edge.node.fields.slug, // required
        component: slash(blogPostTemplate),
        context: {
          slug: edge.node.fields.slug,
          highlight: edge.node.frontmatter.highlight,
          shadow: edge.node.frontmatter.shadow,
        },
      })
    })
    // Create tag pages.
  })
}

// Add custom url pathname for blog posts.
exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions

  // if (node.internal.type === `File`) {
  //   const parsedFilePath = path.parse(node.absolutePath)
  //   const slug = `/${parsedFilePath.dir.split(`---`)[1]}/`
  //   console.log("TCL: exports.onCreateNode -> slug", slug)
  //   createNodeField({ node, name: `slug`, value: slug })
  // } else

  if (node.internal.type === `Mdx` && typeof node.slug === `undefined`) {
    console.log("TCL: exports.onCreateNode -> node", node)
    // const fileNode = getNode(node.parent)
    // console.log("TCL: exports.onCreateNode -> fileNode", fileNode)
    // console.log("fileNode.fields", fileNode.fields)
    // createNodeField({
    //   node,
    //   name: `slug`,
    //   value: fileNode.fields.slug,
    // })

    // const parsedFilePath = path.parse(node.absolutePath)
    // const slug = `/${parsedFilePath.dir.split(`---`)[1]}/`
    // console.log("TCL: exports.onCreateNode -> slug", slug)
    // createNodeField({ node, name: `slug`, value: slug })

    const value = createFilePath({ node, getNode })
    const newSlug = `/${node.frontmatter.lang}${value}`
    console.log("newSlug", newSlug)

    createNodeField({
      node,
      name: "slug",
      value: newSlug,
    })
    createNodeField({
      node,
      name: "originalPath",
      value: newSlug.substr(3),
    })
  }
}
