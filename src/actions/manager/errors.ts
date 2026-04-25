import { MANAGER_ERRORS } from "./constants";

export function mapAcceptPlayerJoinRequestError(error: unknown): string {
	if (
		typeof error === "object" &&
		error !== null &&
		"code" in error &&
		(error as { code?: string }).code === "23505"
	) {
		return "Ese dorsal ya está usado en tu equipo.";
	}

	if (error instanceof Error) {
		switch (error.message) {
			case MANAGER_ERRORS.WITHOUT_TEAM:
				return "Tu cuenta de manager no tiene equipo asignado.";
			case MANAGER_ERRORS.REQUEST_NOT_FOUND:
				return "La solicitud no existe o ya fue procesada.";
			case MANAGER_ERRORS.REQUEST_NOT_IN_MANAGER_TEAM:
				return "No puedes gestionar solicitudes de otro equipo.";
			case MANAGER_ERRORS.JERSEY_ALREADY_USED:
				return "Ese dorsal ya está usado en tu equipo.";
			default:
				return "No se pudo aceptar la solicitud.";
		}
	}

	return "No se pudo aceptar la solicitud.";
}