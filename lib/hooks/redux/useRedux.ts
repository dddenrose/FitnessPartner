"use client";

import { useDispatch, useSelector, useStore } from "react-redux";
import type { AppDispatch, AppStore, RootState } from "../../store";

/**
 * 類型安全的 Redux dispatch hook
 *
 * 使用 TypeScript 提供完整類型推導的 useDispatch
 */
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();

/**
 * 類型安全的 Redux selector hook
 *
 * 使用 TypeScript 提供完整類型推導的 useSelector
 */
export const useAppSelector = useSelector.withTypes<RootState>();

/**
 * 類型安全的 Redux store hook
 *
 * 使用 TypeScript 提供完整類型推導的 useStore
 */
export const useAppStore = useStore.withTypes<AppStore>();
