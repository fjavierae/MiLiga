import { Response } from "@/types";

export interface AcceptPlayerJoinRequestInput {
	requestId: string;
	jerseyNumber: number;
}

const getFormString = (formData: FormData, fieldName: string): string => {
	const value = formData.get(fieldName);
	return typeof value === "string" ? value.trim() : "";
};

export function validateAcceptPlayerJoinRequest(
	formData: FormData
): Response<AcceptPlayerJoinRequestInput> {
	const requestId = getFormString(formData, "requestId");
	const jerseyNumberValue = getFormString(formData, "jerseyNumber");
	const jerseyNumber = Number(jerseyNumberValue);

	if (!requestId) {
		return new Response<AcceptPlayerJoinRequestInput>(null, "Solicitud inválida.");
	}

	if (!Number.isInteger(jerseyNumber) || jerseyNumber < 1 || jerseyNumber > 99) {
		return new Response<AcceptPlayerJoinRequestInput>(null, "El dorsal debe ser un número entre 1 y 99.");
	}

	return new Response<AcceptPlayerJoinRequestInput>({
		requestId,
		jerseyNumber,
	}, null);
}