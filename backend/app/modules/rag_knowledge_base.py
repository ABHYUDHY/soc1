from __future__ import annotations

from dataclasses import dataclass


@dataclass
class KnowledgeDoc:
    title: str
    content: str


KNOWLEDGE_BASE = [
    KnowledgeDoc("MITRE T1059", "Command and Scripting Interpreter abuse often leverages powershell execution."),
    KnowledgeDoc("CVE-2021-44228", "Log4Shell allows remote code execution through crafted JNDI strings."),
    KnowledgeDoc("Ransomware Playbook", "Isolate host, disable SMB lateral movement, rotate credentials, preserve forensic image."),
    KnowledgeDoc("Malware C2", "Beaconing to rare external IPs with unusual ports can indicate command-and-control channels."),
]
