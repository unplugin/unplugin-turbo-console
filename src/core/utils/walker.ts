// Ref: https://github.com/danielroe/oxc-walker/blob/main/src/index.ts
import type { Node as ESTreeNode, Program as ESTreeProgram } from 'estree'
import type { SyncHandler } from 'estree-walker'

import type { CatchClause, ClassBody, Declaration, ExportSpecifier, Expression, ImportDefaultSpecifier, ImportNamespaceSpecifier, ImportSpecifier, MagicString, MethodDefinition, ModuleDeclaration, ObjectProperty, ParseResult, Pattern, PrivateIdentifier, Program, PropertyDefinition, SpreadElement, Statement, Super, SwitchCase, TemplateElement } from 'oxc-parser'

/** estree also has AssignmentProperty, Identifier and Literal as possible node types */
export type Node = Declaration | Expression | ClassBody | CatchClause | MethodDefinition | ModuleDeclaration | ImportSpecifier | ImportDefaultSpecifier | ImportNamespaceSpecifier | ExportSpecifier | Pattern | PrivateIdentifier | Program | SpreadElement | Statement | Super | SwitchCase | TemplateElement | ObjectProperty | PropertyDefinition

type WalkerCallback = (this: ThisParameterType<SyncHandler>, node: Node, parent: Node | null, ctx: { key: string | number | symbol | null | undefined, index: number | null | undefined, ast: Program | Node, magicString?: MagicString | undefined }) => void

export async function walk(input: Program | Node | ParseResult, callback: { enter?: WalkerCallback, leave?: WalkerCallback }) {
  const [ast, magicString] = 'magicString' in input ? [input.program, input.magicString] : [input]
  const { walk: _walk } = await import('estree-walker')
  return _walk(ast as unknown as ESTreeProgram | ESTreeNode, {
    enter(node, parent, key, index) {
      callback.enter?.call(this, node as Node, parent as Node | null, { key, index, ast, magicString })
    },
    leave(node, parent, key, index) {
      callback.leave?.call(this, node as Node, parent as Node | null, { key, index, ast, magicString })
    },
  }) as Program | Node | null
}
