import { imageUrl } from "../config.ts";
interface Props {
  name: string;
  alt: string;
  className?: string;
  priority?: boolean;
}
export default function Photo({
  name,
  alt,
  className = "",
  priority = false,
}: Props) {
  return (
    <img
      className={className}
      src={imageUrl(name)}
      alt={alt}
      width={1536}
      height={1024}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : "auto"}
      onError={(event) => {
        const target = event.currentTarget;
        if (!target.dataset.fallback) {
          target.dataset.fallback = "true";
          target.src = `${import.meta.env.BASE_URL}images/fallback.svg`;
          target.alt = `Imagem indisponível. Ilustração arquitetônica provisória. ${alt}`;
        }
      }}
    />
  );
}
