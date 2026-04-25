"use server";

import { getSession } from "@/lib/auth";
import { UserRole } from "@/types";
import {
	acceptPlayerJoinRequest as acceptPlayerJoinRequestRepository,
	getPendingJoinRequests as getPendingJoinRequestsRepository,
	type JoinRequestNotification,
	type ManagerActionState,
} from "./repository";
import { validateAcceptPlayerJoinRequest } from "./validation";
import { mapAcceptPlayerJoinRequestError } from "./errors";

export type { JoinRequestNotification, ManagerActionState } from "./repository";

export async function getPendingJoinRequests(): Promise<JoinRequestNotification[]> {
	const session = await getSession();

	if (!session || session.role !== UserRole.MANAGER || typeof session.id !== "string") {
		return [];
	}

	return getPendingJoinRequestsRepository(session.id);
}

export async function acceptPlayerJoinRequest(
	_: ManagerActionState,
	formData: FormData
): Promise<ManagerActionState> {
	const session = await getSession();

	if (!session || session.role !== UserRole.MANAGER || typeof session.id !== "string") {
		return { error: "No autorizado." };
	}

	const validation = validateAcceptPlayerJoinRequest(formData);

	if (!validation.isSuccess()) {
		return { error: validation.getError() ?? "Solicitud inválida." };
	}

	const input = validation.getData();

	if (!input) {
		return { error: "Solicitud inválida." };
	}

	try {
		await acceptPlayerJoinRequestRepository(session.id, input);
		return { success: "Jugador aceptado correctamente." };
	} catch (error) {
		return { error: mapAcceptPlayerJoinRequestError(error) };
	}
}