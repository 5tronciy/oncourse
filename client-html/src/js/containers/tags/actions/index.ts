import { Tag } from "@api/model";
import { _toRequestType, FULFILLED } from "../../../common/actions/ActionUtils";

export const GET_ALL_TAGS_REQUEST = _toRequestType("get/tags");
export const GET_ALL_TAGS_FULFILLED = FULFILLED(GET_ALL_TAGS_REQUEST);

export const GET_LIST_TAGS_REQUEST = _toRequestType("get/listView/tag");

export const GET_ENTITY_TAGS_REQUEST = _toRequestType("get/entity/tag");
export const GET_ENTITY_TAGS_REQUEST_FULFILLED = FULFILLED(GET_ENTITY_TAGS_REQUEST);

export const UPDATE_TAG_REQUEST = _toRequestType("put/tag");

export const GET_TAG_REQUEST = _toRequestType("get/tag");

export const CREATE_TAG_REQUEST = _toRequestType("post/tag");

export const DELETE_TAG_REQUEST = _toRequestType("delete/tag");

export const getTagRequest = (id: number) => ({
  type: GET_TAG_REQUEST,
  payload: id
});

export const deleteTag = (tag: Tag) => ({
  type: DELETE_TAG_REQUEST,
  payload: tag
});

export const createTag = (tag: Tag) => ({
  type: CREATE_TAG_REQUEST,
  payload: tag
});

export const updateTag = (id: number, tag: Tag) => ({
  type: UPDATE_TAG_REQUEST,
  payload: { id, tag }
});

export const getAllTags = (nameToSelect?: string) => ({
  type: GET_ALL_TAGS_REQUEST,
  payload: { nameToSelect }
});

export const getListTags = (entityName: string) => ({
  type: GET_LIST_TAGS_REQUEST,
  payload: { entityName }
});

export const getEntityTags = (entityName: string) => ({
  type: GET_ENTITY_TAGS_REQUEST,
  payload: { entityName }
});
