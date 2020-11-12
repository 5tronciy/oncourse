/*
 * Copyright ish group pty ltd 2020.
 *
 * This program is free software: you can redistribute it and/or modify it under the terms of the
 * GNU Affero General Public License version 3 as published by the Free Software Foundation.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY;
 * without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 * See the GNU Affero General Public License for more details.
 */
package ish.oncourse.cayenne;

import org.apache.cayenne.exp.Expression;
import org.apache.cayenne.exp.ExpressionFactory;

import java.util.List;

/**
 * Utility class for specific actions related to Tag entity
 *
 */
public final class TagUtil {
	public static final String ALIAS = "alias";

	public static final String TAG_PATH = "taggingRelations";
	private TagUtil() {}

    /**
	 * creates an expression for given list of tags. the tags have to be within one tag tree.
	 *
	 * @param alias to use
	 * @param tags to generate query for
	 * @param entity to generate the expressions for
	 * @return Expression
	 */
	public static <T extends TagInterface> Expression createExpressionForTagsWithinOneTagTree(String alias, List<T> tags, TaggableClasses entity) {
		if (tags == null || tags.size() == 0 || entity == null) {
			return null;
		}

		TagInterface root = null;
		for (TagInterface tag : tags) {
			if (root == null) {
				root = getRoot(tag);
			} else if (!root.equals(getRoot(tag))) {
				throw new IllegalArgumentException("The tags have to belong to the same tag tree");
			}
		}

		Expression result = null;
		for (TagInterface tag : tags) {

			Expression expression = createExpressionForTag(alias, tag, entity);
			if (result == null) {
				result = expression;
			} else {
				result = result.orExp(expression);
			}
		}
		return result;
	}

	/**
	 * Creates an expression for a given Tag
	 *
	 * @param alias to use
	 * @param tag to create expression for
	 * @param entity for which the expression is to be created
	 * @return Expression
	 */
	public static <T extends TagInterface> Expression createExpressionForTag(String alias, T tag, TaggableClasses entity) {
		Expression expression = ExpressionFactory.matchExp(ALIAS + alias + "+." + TagRelationInterface.TAG_PROPERTY + "." + TagInterface.ID_PROPERTY, tag.getId());
		expression = expression.andExp(ExpressionFactory.matchExp(ALIAS + alias + "+." + TagRelationInterface.ENTITY_IDENTIFIER_PROPERTY, entity));
		return expression;
	}

	/**
	 * @return top-most parent of the given tag
	 */
	public static <T extends TagInterface> T getRoot(T tag) {
		if (tag.getParentTag() == null) {
			return tag;
		}
		return (T) getRoot(tag.getParentTag());
	}
}
