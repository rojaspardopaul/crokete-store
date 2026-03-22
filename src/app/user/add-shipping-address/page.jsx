"use client";

import { useActionState, useState } from "react";
import { FiLoader } from "react-icons/fi";

//internal imports

import Error from "@components/form/Error";
import ErrorTwo from "@components/form/ErrorTwo";
import { getUserSession } from "@lib/auth-client";
import useCustomToast from "@hooks/useCustomToast";
import InputAreaTwo from "@components/form/InputAreaTwo";
import SelectOption from "@components/form/SelectOption";
import SubmitButton from "@components/user-dashboard/SubmitButton";
import { addShippingAddress } from "@services/ServerActionServices";
import usePostalCodeLookup from "@hooks/usePostalCodeLookup";

const AddShippingAddress = () => {
  const userInfo = getUserSession();
  const [state, formAction] = useActionState(
    addShippingAddress.bind(null, userInfo),
    undefined
  );

  const [postalCode, setPostalCode] = useState("");
  const [selectedColonia, setSelectedColonia] = useState("");
  const { colonias, municipio, estado, loading, error: cpError } =
    usePostalCodeLookup(postalCode);

  const handlePostalCodeChange = (e) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 5);
    setPostalCode(value);
    setSelectedColonia("");
  };

  const { formRef } = useCustomToast(state);

  return (
    <div className="max-w-screen-2xl">
      <div className="md:grid md:grid-cols-3 md:gap-6">
        <div className="md:col-span-1">
          <div className="px-4 sm:px-0">
            <h2 className="text-xl font-semibold mb-5">Agregar Dirección de Envío</h2>
            <p className="text-sm text-gray-500">
              Zona de cobertura: Zona Metropolitana de Guadalajara, Jalisco, México.
            </p>
          </div>
        </div>
      </div>
      <form ref={formRef} action={formAction}>
        <div className="mt-5 md:mt-0 md:col-span-2">
          <div className="bg-white shadow sm:rounded-lg py-4 px-2">
            <div className="mt-10 sm:mt-0">
              <div className="md:grid-cols-6 md:gap-6">
                <div className="mt-5 md:mt-0 md:col-span-2">
                  <div className="lg:mt-6 mt-4 bg-white">
                    <div className="grid grid-cols-6 gap-6">
                      {/* Nombre Completo */}
                      <div className="col-span-6 sm:col-span-3">
                        <InputAreaTwo
                          label="Nombre Completo"
                          name="name"
                          type="text"
                          placeholder="Ingresa tu nombre completo"
                        />
                        <Error errorName={state?.errors?.name?.join(" ")} />
                      </div>

                      {/* Teléfono */}
                      <div className="col-span-6 sm:col-span-3">
                        <InputAreaTwo
                          label="Teléfono"
                          name="contact"
                          type="tel"
                          placeholder="10 dígitos, ej: 3312345678"
                        />
                        <ErrorTwo errors={state?.errors?.contact} />
                      </div>

                      {/* Código Postal */}
                      <div className="col-span-6 sm:col-span-2">
                        <InputAreaTwo
                          label="Código Postal"
                          name="postalCode"
                          type="text"
                          placeholder="Ej: 44100"
                          value={postalCode}
                          onChange={handlePostalCodeChange}
                          maxLength={5}
                        />
                        {loading && (
                          <p className="text-xs text-blue-500 mt-1 flex items-center gap-1">
                            <FiLoader className="animate-spin" /> Buscando...
                          </p>
                        )}
                        {cpError && (
                          <p className="text-xs text-red-500 mt-1">{cpError}</p>
                        )}
                        <Error errorName={state?.errors?.postalCode?.join(" ")} />
                      </div>

                      {/* Colonia */}
                      <div className="col-span-6 sm:col-span-2">
                        {colonias.length > 1 ? (
                          <>
                            <SelectOption
                              name="coloniaSelect"
                              label="Colonia"
                              options={colonias}
                              onChange={(_, value) => setSelectedColonia(value)}
                              value={selectedColonia}
                            />
                            <input type="hidden" name="colonia" value={selectedColonia} />
                          </>
                        ) : (
                          <InputAreaTwo
                            label="Colonia"
                            name="colonia"
                            type="text"
                            placeholder="Ingresa tu código postal primero"
                            defaultValue={colonias[0] || ""}
                            readOnly={colonias.length === 1}
                          />
                        )}
                        <Error errorName={state?.errors?.colonia?.join(" ")} />
                      </div>

                      {/* Municipio */}
                      <div className="col-span-6 sm:col-span-2">
                        <InputAreaTwo
                          label="Municipio / Zona"
                          name="municipio"
                          type="text"
                          placeholder="Se llena con el C.P."
                          value={municipio}
                          readOnly={true}
                        />
                        <Error errorName={state?.errors?.municipio?.join(" ")} />
                      </div>

                      {/* Calle */}
                      <div className="col-span-6 sm:col-span-3">
                        <InputAreaTwo
                          label="Calle"
                          name="calle"
                          type="text"
                          placeholder="Nombre de la calle"
                        />
                        <Error errorName={state?.errors?.calle?.join(" ")} />
                      </div>

                      {/* Número Exterior */}
                      <div className="col-span-3 sm:col-span-1">
                        <InputAreaTwo
                          label="Núm. Exterior"
                          name="numExterior"
                          type="text"
                          placeholder="Ej: 45"
                        />
                        <Error errorName={state?.errors?.numExterior?.join(" ")} />
                      </div>

                      {/* Número Interior */}
                      <div className="col-span-3 sm:col-span-1">
                        <InputAreaTwo
                          label="Núm. Interior"
                          name="numInterior"
                          type="text"
                          placeholder="Opcional"
                        />
                      </div>

                      {/* Referencias */}
                      <div className="col-span-6">
                        <InputAreaTwo
                          label="Referencias (opcional)"
                          name="referencias"
                          type="text"
                          placeholder="Ej: Entre calle Morelos y calle Hidalgo, portón negro"
                        />
                      </div>
                    </div>

                    {/* Hidden fields: estado, pais */}
                    <input type="hidden" name="estado" value="Jalisco" />
                    <input type="hidden" name="pais" value="México" />

                    <div className="col-span-6 sm:col-span-3 mt-5 text-right">
                      <SubmitButton title="Agregar Dirección de Envío" />
                    </div>
                  </div>
                  {/* passing user _id  */}
                  <div className="form-group hidden">
                    <InputAreaTwo
                      label="userId"
                      name="userId"
                      type="text"
                      defaultValue={userInfo?._id}
                      placeholder="userId"
                      readOnly={true}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddShippingAddress;
