from core.database import Base
from datetime import datetime
from sqlalchemy import Column, DateTime, Float, Integer, String


class Clients(Base):
    __tablename__ = "clients"
    __table_args__ = {"extend_existing": True}

    id = Column(Integer, primary_key=True, index=True, autoincrement=True, nullable=False)
    cnpj = Column(String, nullable=False)
    razao_social = Column(String, nullable=False)
    nome_fantasia = Column(String, nullable=True)
    plano = Column(String, nullable=False)
    status = Column(String, nullable=False)
    regiao = Column(String, nullable=True)
    estado = Column(String, nullable=True)
    email_contato = Column(String, nullable=True)
    telefone = Column(String, nullable=True)
    responsavel = Column(String, nullable=True)
    area_monitorada_ha = Column(Float, nullable=True)
    data_contrato = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), default=datetime.now)
    updated_at = Column(DateTime(timezone=True), default=datetime.now, onupdate=datetime.now)