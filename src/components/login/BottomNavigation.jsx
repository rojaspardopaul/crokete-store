"use client";

import Link from "next/link";
import { ImFacebook, ImGithub, ImGoogle } from "react-icons/im";
import { signIn } from "next-auth/react";
import { Button } from "@components/ui/button";
import { useSetting } from "@context/SettingContext";

const isWebView = () => {
  if (typeof window === "undefined") return false;
  const ua = navigator.userAgent || "";
  // Detect Android WebView, in-app browsers (Instagram, Facebook, etc.)
  return (
    /wv/.test(ua) ||
    /FBAN|FBAV/.test(ua) ||
    /Instagram/.test(ua) ||
    /Twitter/.test(ua) ||
    (ua.includes("Android") && !ua.includes("Chrome")) ||
    (ua.includes("iPhone") && !ua.includes("Safari") && ua.includes("Mobile"))
  );
};

const BottomNavigation = ({ or, route, desc, pageName, loginTitle }) => {
  const { storeSetting } = useSetting();

  const googleEnabled = storeSetting?.google_oauth_ready === true;
  const facebookEnabled = storeSetting?.facebook_oauth_ready === true;
  const githubEnabled = storeSetting?.github_oauth_ready === true;
  const hasSocialProviders = googleEnabled || facebookEnabled || githubEnabled;
  const inWebView = hasSocialProviders && isWebView();

  const buttonStyles = `
    text-sm cursor-pointer transition ease-in-out duration-300 font-semibold text-center justify-center rounded-md focus:outline-none shadow-sm
    px-3 py-4 mb-6 mr-2
  `;

  return (
    <>
      {or && hasSocialProviders && (
        <div className="my-4 text-center font-medium">
          <div className="after:bg-gray-100 before:bg-gray-100">O</div>
        </div>
      )}

      {inWebView && (
        <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800">
          <p className="font-semibold mb-1">⚠️ Abre en tu navegador</p>
          <p>Para iniciar sesión con Google, abre este sitio directamente en <strong>Chrome</strong> o <strong>Safari</strong> en lugar de desde otra aplicación.</p>
          <button
            type="button"
            onClick={() => navigator.clipboard?.writeText(window.location.href)}
            className="mt-2 text-xs underline text-amber-700"
          >
            Copiar enlace
          </button>
        </div>
      )}

      {hasSocialProviders && !inWebView && (
        <div className="flex flex-col mb-4">
          {googleEnabled && (
            <Button
              onClick={() =>
                signIn("google", { callbackUrl: "/user/dashboard", redirect: true })
              }
              className={buttonStyles + "bg-green-600 text-white hover:bg-green-700"}
            >
              <ImGoogle className="text-2xl" />
              <span className="ml-2">{loginTitle} con Google</span>
            </Button>
          )}
          {facebookEnabled && (
            <Button
              onClick={() =>
                signIn("facebook", { callbackUrl: "/user/dashboard", redirect: true })
              }
              className={buttonStyles + "bg-blue-500 text-white hover:bg-blue-600"}
            >
              <ImFacebook className="text-2xl" />
              <span className="ml-2">{loginTitle} con Facebook</span>
            </Button>
          )}
          {githubEnabled && (
            <Button
              onClick={() =>
                signIn("github", { callbackUrl: "/user/dashboard", redirect: true })
              }
              className={buttonStyles + "bg-gray-700 text-white hover:bg-gray-900"}
            >
              <ImGithub className="text-2xl" />
              <span className="ml-2">{loginTitle} con Github</span>
            </Button>
          )}
        </div>
      )}

      <div className="text-center text-sm text-gray-900 mt-4">
        <div className="text-gray-500 mt-2.5">
          {desc ? "Ya tienes una cuenta?" : "No estás registrado?"}
          <Link
            href={route}
            className="text-gray-800 hover:text-cyan-500 font-bold mx-2"
          >
            <span className="capitalize">{pageName}</span>
          </Link>
        </div>
      </div>
    </>
  );
};

export default BottomNavigation;
